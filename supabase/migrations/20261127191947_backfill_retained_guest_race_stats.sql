do $$
declare
  v_room record;
begin
  for v_room in
    select id from public.race_rooms where status = 'finished'
  loop
    perform public.record_race_stats(v_room.id);
  end loop;
end
$$;

