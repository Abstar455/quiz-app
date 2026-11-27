create table if not exists public.player_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  friend_code text not null unique check (friend_code ~ '^[A-Z2-9]{8}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.player_profiles enable row level security;
revoke all on public.player_profiles from anon, authenticated;

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  check (sender_id <> recipient_id),
  unique (sender_id, recipient_id)
);
create index if not exists friend_requests_recipient_status_idx on public.friend_requests(recipient_id,status);
create index if not exists friend_requests_sender_status_idx on public.friend_requests(sender_id,status);
alter table public.friend_requests enable row level security;
revoke all on public.friend_requests from anon, authenticated;

create table if not exists public.solo_quiz_results (
  attempt_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 24),
  category text not null,
  correct_count integer not null check (correct_count >= 0),
  question_count integer not null check (question_count between 1 and 100),
  completed_at timestamptz not null default now(),
  check (correct_count <= question_count)
);
create index if not exists solo_quiz_results_user_completed_idx on public.solo_quiz_results(user_id,completed_at desc);
alter table public.solo_quiz_results enable row level security;
revoke all on public.solo_quiz_results from anon, authenticated;

