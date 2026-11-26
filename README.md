# Quiz App

A static quiz app with optional room-code races. Solo play stays open; multiplayer players can join as guests with a nickname. A permanent account is only needed to sync stats across devices or appear on the all-time leaderboard.

## How the free setup works

GitHub Pages serves the website files. Supabase Free supplies anonymous guest sessions, the database, the race API, and realtime room updates. GitHub Pages cannot run server code, so Supabase is the app's small free backend. There is no paid AI API in the game.

The current race mode supports up to 20 players in a room, five questions per race, 15 seconds per question, room codes, live scores, answer review, and an all-time leaderboard for linked accounts. The private server-side seed contains 144 distinct questions: 26 programming, 29 geography, 60 mathematics, and 29 entertainment.

## Publish the website

1. Create a **public** repository on GitHub (free GitHub Pages requires a public repository on the Free plan). Do not initialize it with a README or license; this folder already has files.
2. In this folder, run:

   ```powershell
   git add .
   git commit -m "Prepare Quiz App for GitHub Pages"
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```

3. In GitHub, open **Settings → Pages**, select **GitHub Actions**, and wait for the workflow to finish. The website URL is shown in the Pages settings.

The repository is public, so anyone can read all committed files. The private question seed is ignored by Git and is intentionally not part of the published website.

## Connect the free multiplayer backend

1. Create a Supabase project on the Free plan and copy its project reference and URL.
2. Install the Supabase CLI, then run these commands in this folder:

   ```powershell
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   supabase functions deploy race
   ```

   `db push` creates the race tables and security policies. The Edge Function uses Supabase's server environment; never put its service-role key in website code.
3. In the Supabase **SQL Editor**, open the local `supabase/private-question-seed.sql` file and run its contents. This file stays local and is ignored by Git; the browser never receives the answer key.
4. In Supabase **Authentication → Sign In / Providers**, enable **Anonymous sign-ins** and **Manual identity linking**. Under **URL Configuration**, set the Site URL to `https://abstar455.github.io/quiz-app/` and add that same URL under allowed redirect URLs. Google, Apple, and email providers are optional; each needs its own provider setup.
5. Copy the project URL and the browser-safe **publishable key** into `backend-config.js`. The publishable key is designed to be public; do not use the service-role/secret key there.
6. Push the updated `backend-config.js` to GitHub. The Pages workflow will publish the connected version.

Guests do not have to sign up. Their anonymous identity is stored in that browser; clearing browser data can lose it. From Account, a guest can link Google or email later. Configure each provider in Supabase first. Email delivery for real users may require SMTP configuration. Apple sign-in also requires Apple provider credentials. If a user links an account later, the app attempts to sync their completed races to the persistent leaderboard.

## Free-tier limits and scope

Supabase Free currently lists a 500 MB database, up to 200 concurrent realtime connections, and 2 million realtime messages monthly. Free projects can pause after a period of low activity, so the races will be temporarily unavailable until the project is resumed. Quotas and plan terms can change; this setup has no paid backend budget guarantee.

This is a first multiplayer version for casual races, not a tournament-grade anti-cheat system. Keep the question bank small enough for the free database and avoid storing sensitive personal information. The all-time leaderboard is public to app users and only includes linked accounts.

Never commit database passwords, private question files, or service-role/secret keys.


