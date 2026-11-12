# FORGE Gym App

FORGE is a responsive fitness web app with a fully usable local demo and an optional authenticated Supabase + OpenAI AI layer. The app is built with plain HTML, CSS and JavaScript so it is easy to open and edit in VS Code.

## Open the demo

Open this folder in VS Code and run `index.html` with the Live Server extension, or run `npx serve .` in this folder. The local demo works without accounts or API keys and saves workout, meal, hydration and check-in data in that browser's local storage. Use an HTTP server for Supabase sign-in and live AI; `file://` cannot use those services.

## What works in the local demo

- Responsive multi-page dashboard, training plan, exercise library (52 starter movements across 15 disciplines), nutrition, history/analytics, recovery, community and coach discovery.
- Goal-based starter training weeks and exercise recommendations for strength, powerlifting, bodybuilding, athlete conditioning, running, calisthenics, general fitness and mobility.
- Guided workout sessions with sets, rest timer and saved history; editable weekly movement target and personal records.
- Food and water logs, preference-aware sample food search, and an adult nutrition estimate from age, height, weight and activity.
- Manual steps, sleep, active minutes, energy and soreness check-ins; symptom guidance is informational and never diagnoses.
- Swipe-style trainer cards, gym-buddy matcher and worldwide/nation/region/sport leaderboard previews. These profiles and ranks are sample data, not live users.
- Rule-based coach fallback while live AI is not configured.

## Enable accounts, cloud save and live AI

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor. Row Level Security limits each account to its own saved state.
2. Copy `supabase-config.example.js` to `supabase-config.js` and add your project's URL and public publishable/anon key. The ignored `supabase-config.js` must not contain a service-role key or provider key.
3. Set up Supabase Auth email/password and serve the app over HTTP.
4. Deploy the authenticated Edge Function from this project with the Supabase CLI: `supabase functions deploy forge-ai`.
5. Add your OpenAI key as a Supabase secret, never in browser code: `supabase secrets set OPENAI_API_KEY=your_key`. The optional model secret defaults to `gpt-4.1-mini`.
6. Create an account/sign in in FORGE. Cloud state sync and live coach, workout analysis and meal-photo estimates require the deployed function, a signed-in account and valid project/provider credentials.

The Edge Function verifies the signed-in user, keeps the provider key on the server and accepts only coach, workout analysis and meal-photo tasks. A meal photo is uploaded only after the user selects Analyze. Estimates can be wrong; review before logging.

## Limits

This is a prototype, not a medical device or production social network. Exercise catalog, trainer profiles, gym buddies and rankings use sample data. Wearable integrations, verified global ranking, real trainer booking/chat, payments and production moderation are not connected. Symptom guidance is not diagnosis or treatment; seek a clinician for injury concerns and urgent care for red-flag symptoms. Nutrition estimates are rough starting points for adults, not a prescribed diet.

Never commit Supabase service-role credentials or an OpenAI API key. Only the public Supabase key belongs in `supabase-config.js`, protected by the project's RLS policies.

