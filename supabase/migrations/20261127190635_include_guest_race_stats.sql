create or replace function public.record_race_stats(p_room_id uuid)
returns integer language plpgsql security definer set search_path = ''
as $$
declare
  v_count integer;
begin
  with ranked as (
    select rp.user_id, rp.nickname, rp.score, rp.correct_count,
      row_number() over (order by rp.score desc, rp.correct_count desc, rp.joined_at asc) as finish_rank
    from public.race_players rp where rp.room_id = p_room_id
  ), inserted as (
    insert into public.recorded_race_stats(room_id, user_id, finish_rank)
    select p_room_id, ranked.user_id, ranked.finish_rank from ranked
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
revoke all on function public.record_race_stats(uuid) from public, anon, authenticated;
grant execute on function public.record_race_stats(uuid) to service_role;

