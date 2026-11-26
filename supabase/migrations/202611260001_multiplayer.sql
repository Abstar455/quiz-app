create extension if not exists pgcrypto;

create table if not exists public.race_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique check (room_code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  host_user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('Programming', 'Geography', 'Mathematics', 'Entertainment')),
  question_count integer not null default 5 check (question_count between 5 and 25),
  status text not null default 'lobby' check (status in ('lobby', 'live', 'finished', 'cancelled')),
  question_index integer not null default 0,
  question_deadline timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '2 hours'
);

create table if not exists public.race_players (
  room_id uuid not null references public.race_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  is_guest boolean not null default true,
  score integer not null default 0 check (score >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  joined_at timestamptz not null default now(),
  primary key (room_id, user_id)
);
create index if not exists race_players_room_score_idx on public.race_players (room_id, score desc, joined_at asc);

create table if not exists public.quiz_question_bank (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('Programming', 'Geography', 'Mathematics', 'Entertainment')),
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) >= 2),
  correct_index smallint not null check (correct_index between 0 and 3),
  explanation text not null default '',
  enabled boolean not null default true
);
create unique index if not exists quiz_question_bank_category_prompt_idx
  on public.quiz_question_bank (category, prompt);

create table if not exists public.race_room_questions (
  room_id uuid not null references public.race_rooms(id) on delete cascade,
  question_index integer not null,
  category text not null,
  prompt text not null,
  options jsonb not null,
  correct_index smallint not null,
  explanation text not null,
  primary key (room_id, question_index)
);

create table if not exists public.race_answers (
  room_id uuid not null,
  user_id uuid not null,
  question_index integer not null,
  answer_index smallint not null,
  is_correct boolean not null,
  points integer not null,
  answered_at timestamptz not null default now(),
  primary key (room_id, user_id, question_index),
  foreign key (room_id, user_id) references public.race_players(room_id, user_id) on delete cascade,
  foreign key (room_id, question_index) references public.race_room_questions(room_id, question_index) on delete cascade
);

create table if not exists public.player_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  races_played integer not null default 0,
  races_won integer not null default 0,
  correct_answers integer not null default 0,
  total_points bigint not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.recorded_race_stats (
  room_id uuid not null references public.race_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  finish_rank integer not null,
  primary key (room_id, user_id)
);

alter table public.race_rooms enable row level security;
alter table public.race_players enable row level security;
alter table public.quiz_question_bank enable row level security;
alter table public.race_room_questions enable row level security;
alter table public.race_answers enable row level security;
alter table public.player_stats enable row level security;
alter table public.recorded_race_stats enable row level security;

create or replace function public.is_race_member(p_room_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.race_players rp
    where rp.room_id = p_room_id and rp.user_id = auth.uid()
  );
$$;
revoke all on function public.is_race_member(uuid) from public;
grant execute on function public.is_race_member(uuid) to authenticated;

create policy "room members can read their rooms"
  on public.race_rooms for select to authenticated
  using (public.is_race_member(id));
create policy "room members can read their roster"
  on public.race_players for select to authenticated
  using (public.is_race_member(room_id));
-- The question bank, answer keys, answers, and writes have no client policies.
-- Only the server-side Edge Function accesses those tables with its service key.

create or replace function public.submit_race_answer(
  p_room_id uuid, p_user_id uuid, p_question_index integer, p_answer_index smallint
)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_room public.race_rooms%rowtype;
  v_question public.race_room_questions%rowtype;
  v_points integer;
  v_is_correct boolean;
  v_inserted integer;
begin
  select * into v_room from public.race_rooms where id = p_room_id for update;
  if not found or v_room.status <> 'live' then raise exception 'Race is not live'; end if;
  if v_room.question_index <> p_question_index then raise exception 'Question is no longer active'; end if;
  if v_room.question_deadline is null or clock_timestamp() > v_room.question_deadline then
    raise exception 'Answer window is closed';
  end if;
  if not exists (
    select 1 from public.race_players rp
    where rp.room_id = p_room_id and rp.user_id = p_user_id
  ) then raise exception 'Player is not in this room'; end if;
  select * into v_question from public.race_room_questions
  where room_id = p_room_id and question_index = p_question_index;
  if not found or p_answer_index < 0 or p_answer_index >= jsonb_array_length(v_question.options) then
    raise exception 'Invalid answer';
  end if;

  v_is_correct := p_answer_index = v_question.correct_index;
  v_points := case when v_is_correct then
    1000 + greatest(0, floor(extract(epoch from (v_room.question_deadline - clock_timestamp())) * 25)::integer)
    else 0 end;

  insert into public.race_answers(room_id, user_id, question_index, answer_index, is_correct, points)
  values (p_room_id, p_user_id, p_question_index, p_answer_index, v_is_correct, v_points)
  on conflict do nothing;
  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then return jsonb_build_object('accepted', false, 'duplicate', true); end if;

  update public.race_players
  set score = score + v_points,
      correct_count = correct_count + case when v_is_correct then 1 else 0 end
  where room_id = p_room_id and user_id = p_user_id;
  return jsonb_build_object('accepted', true, 'correct', v_is_correct, 'points', v_points);
end;
$$;

create or replace function public.advance_race_room(p_room_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  v_room public.race_rooms%rowtype;
begin
  select * into v_room from public.race_rooms where id = p_room_id for update;
  if not found then raise exception 'Room not found'; end if;
  if v_room.status <> 'live' then
    return jsonb_build_object('changed', false, 'status', v_room.status, 'question_index', v_room.question_index);
  end if;
  if v_room.question_deadline is null or clock_timestamp() < v_room.question_deadline then
    return jsonb_build_object('changed', false, 'status', v_room.status, 'question_index', v_room.question_index);
  end if;
  if v_room.question_index + 1 >= v_room.question_count then
    update public.race_rooms set status = 'finished', question_deadline = null where id = p_room_id;
    return jsonb_build_object('changed', true, 'status', 'finished', 'question_index', v_room.question_index);
  end if;
  update public.race_rooms
  set question_index = question_index + 1,
      question_deadline = clock_timestamp() + interval '15 seconds'
  where id = p_room_id returning * into v_room;
  return jsonb_build_object('changed', true, 'status', v_room.status, 'question_index', v_room.question_index);
end;
$$;

create or replace function public.record_race_stats(p_room_id uuid)
returns integer language plpgsql security definer set search_path = ''
as $$
declare
  v_count integer;
begin
  with ranked as (
    select rp.user_id, rp.nickname, rp.score, rp.correct_count, au.is_anonymous,
      row_number() over (order by rp.score desc, rp.correct_count desc, rp.joined_at asc) as finish_rank
    from public.race_players rp join auth.users au on au.id = rp.user_id where rp.room_id = p_room_id
  ), inserted as (
    insert into public.recorded_race_stats(room_id, user_id, finish_rank)
    select p_room_id, ranked.user_id, ranked.finish_rank from ranked where ranked.is_anonymous = false
    on conflict do nothing
    returning user_id, finish_rank
  ), totals as (
    select inserted.user_id, inserted.finish_rank, ranked.nickname, ranked.score, ranked.correct_count
    from inserted join ranked using (user_id)
  )
  insert into public.player_stats(user_id, nickname, races_played, races_won, correct_answers, total_points, updated_at)
  select user_id, nickname, 1, case when finish_rank = 1 then 1 else 0 end,
    correct_count, score, now() from totals
  on conflict (user_id) do update set
    nickname = excluded.nickname,
    races_played = public.player_stats.races_played + 1,
    races_won = public.player_stats.races_won + excluded.races_won,
    correct_answers = public.player_stats.correct_answers + excluded.correct_answers,
    total_points = public.player_stats.total_points + excluded.total_points,
    updated_at = now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;
revoke all on function public.submit_race_answer(uuid, uuid, integer, smallint) from public, anon, authenticated;
revoke all on function public.advance_race_room(uuid) from public, anon, authenticated;
revoke all on function public.record_race_stats(uuid) from public, anon, authenticated;
grant execute on function public.submit_race_answer(uuid, uuid, integer, smallint) to service_role;
grant execute on function public.advance_race_room(uuid) to service_role;
grant execute on function public.record_race_stats(uuid) to service_role;

create policy "room members can receive race updates"
  on realtime.messages for select to authenticated
  using (
    extension in ('broadcast', 'presence') and exists (
      select 1 from public.race_players rp
      where rp.room_id::text = split_part(realtime.topic(), ':', 2)
        and rp.user_id = auth.uid()
    )
  );
create policy "room members can publish room refresh events"
  on realtime.messages for insert to authenticated
  with check (
    extension in ('broadcast', 'presence') and exists (
      select 1 from public.race_players rp
      where rp.room_id::text = split_part(realtime.topic(), ':', 2)
        and rp.user_id = auth.uid()
    )
  );
