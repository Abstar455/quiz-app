-- Applied to Supabase as version 20261126232341.
-- Scores are shown only inside the race room through the trusted race function.
-- Do not expose persistent player_stats as a public all-player leaderboard.
drop policy if exists "players can read the public leaderboard" on public.player_stats;
