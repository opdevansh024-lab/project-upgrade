# FORGE Gym App

FORGE is a responsive fitness app with local tracking and an optional authenticated AI manager using Supabase Edge Functions and the OpenAI Responses API.

## Open the demo

Open this folder in VS Code and run `index.html` with Live Server. Without credentials, workouts, meals, hydration, health check-ins and history run locally and save in this browser. Local recommendations are labeled as starter/rule-based previews; they are not live AI.

## AI manager capabilities

After connecting Supabase and OpenAI, FORGE can:

- Generate a seven-day workout plan from the selected goal, experience, schedule, weekly movement goal, recent sessions and the exercise catalog. It validates generated exercise names against the local catalog. After the user generates their first AI week, completing a workout shares that new session to refresh the plan.
- Generate flexible meal ideas from the nutrition profile and food preferences. Calorie and macro estimates remain transparent estimates; AI does not set a medical diet.
- Review logged workout history and movement targets for progress insights.
- Review sleep/activity and the latest symptom note only when the user presses **Ask AI to review recovery**.
- Answer chat questions with the user's training goal, routine, movement target and up to five recent sessions; suggest exercise progressions or swaps.
- Estimate food items from a photo only after the user chooses **Analyze photo with AI**.

Some records are still logged directly by the user. AI recommends and adapts plans; it does not verify reps, diagnose injuries, or read wearable data.

## Enable accounts, cloud save and live AI

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql). Row Level Security limits each account to its own saved state.
2. Copy `supabase-config.example.js` to `supabase-config.js` and add the project URL and public publishable/anon key. Do not add a service-role key or AI provider key here.
3. Set up Supabase Auth email/password and open the app over HTTP with Live Server.
4. Deploy the function with the Supabase CLI: `supabase functions deploy forge-ai`.
5. Add an OpenAI key as a Supabase secret: `supabase secrets set OPENAI_API_KEY=your_key`. Optional model setting defaults to `gpt-4.1-mini`.
6. Create an account/sign in. Live AI requires a signed-in user, deployed function, correct project config and an OpenAI project with billing/credits. Provider usage may incur charges.

The Edge Function verifies the signed-in user and keeps the OpenAI key on the server. Read the privacy copy in the app: chat shares training context, plan generation shares training goals/history, nutrition guidance shares entered body metrics/preferences, recovery review shares the selected check-in and latest symptom note, and meal photos are sent only after Analyze is pressed.

## What is still sample or disconnected

The exercise collection is a starter catalog, not a complete worldwide database. Trainer profiles, gym-buddy matches and leaderboard entries are sample users. Wearable imports, verified global rankings, real trainer booking/chat, payments and production moderation are not connected. Symptom tools are not a diagnosis; seek medical care for injury concerns or red flags. Nutrition numbers are rough adult estimates, not a prescribed diet.

Never commit Supabase service-role credentials or an OpenAI API key. Only the public Supabase key belongs in `supabase-config.js`, protected by the project's RLS policies.

