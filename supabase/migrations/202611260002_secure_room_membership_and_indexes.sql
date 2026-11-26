create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.is_race_member(p_room_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.race_players rp
    where rp.room_id = p_room_id and rp.user_id = auth.uid()
  );
$$;
revoke all on function private.is_race_member(uuid) from public, anon, authenticated;
grant execute on function private.is_race_member(uuid) to authenticated;

drop policy if exists "room members can read their rooms" on public.race_rooms;
drop policy if exists "room members can read their roster" on public.race_players;
create policy "room members can read their rooms"
  on public.race_rooms for select to authenticated
  using (private.is_race_member(id));
create policy "room members can read their roster"
  on public.race_players for select to authenticated
  using (private.is_race_member(room_id));

drop function if exists public.is_race_member(uuid);

create index if not exists race_answers_room_question_idx on public.race_answers (room_id, question_index);
create index if not exists race_players_user_id_idx on public.race_players (user_id);
create index if not exists race_rooms_host_user_id_idx on public.race_rooms (host_user_id);
create index if not exists recorded_race_stats_user_id_idx on public.recorded_race_stats (user_id);

drop policy if exists "room members can receive race updates" on realtime.messages;
drop policy if exists "room members can publish room refresh events" on realtime.messages;
create policy "room members can receive race updates"
  on realtime.messages for select to authenticated
  using (
    extension in ('broadcast', 'presence') and exists (
      select 1 from public.race_players rp
      where rp.room_id::text = split_part(realtime.topic(), ':', 2)
        and rp.user_id = (select auth.uid())
    )
  );
create policy "room members can publish room refresh events"
  on realtime.messages for insert to authenticated
  with check (
    extension in ('broadcast', 'presence') and exists (
      select 1 from public.race_players rp
      where rp.room_id::text = split_part(realtime.topic(), ':', 2)
        and rp.user_id = (select auth.uid())
    )
  );

