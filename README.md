# FORGE Gym App

A responsive fitness app demo with working local interactions and an optional Supabase account/cloud-sync layer.

## Run locally

Serve this folder over HTTP (for example, VS Code Live Server or `npx serve .`) and open `index.html`. Cloud auth uses ES modules, so opening the file directly with `file://` is not supported. Without backend configuration, the demo continues to save to this browser’s local storage.

## Enable accounts and cloud save

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql). The table uses Row Level Security so each signed-in user can access only their own JSON state.
3. Edit `supabase-config.example.js` and fill in the project URL and publishable (or legacy anon) key from the project API settings.
4. Serve the folder over HTTP and use **Sign in** to create an account or sign in. Email confirmation may be required by the project’s Auth settings.

Only the public publishable/anon key belongs in browser configuration. Never put a service-role key or AI provider key in frontend files.

## Features

- Forest-green and warm-mist visual theme across the responsive app screens.
- Guided workouts, food and hydration logging, trainer discovery, challenges, and class schedule demo flows.
- Personal record tracking, bodyweight and mood check-ins, and guided-workout history saved in local browser storage.

## What syncs

The app’s existing demo state (nutrition totals and goals, workout counts, challenge/booking flags, and saved trainers) syncs as one per-user document. The first sync uses the current browser state when the account has no cloud row. An existing cloud row is loaded on sign-in and replaces this browser’s local demo state.

## Current limits

Workout catalog, buddy profiles, leaderboards, trainers, and gym classes use sample data. Coach chat and training analysis are scripted/rule-based previews, not live AI. Meal-photo upload only previews a selected image and logs a sample meal; it does not identify food. Steps, sleep, and activity are manually entered; wearable sync is not connected. The symptom checker is not a medical assessment or diagnosis. Nutrition values are estimates, not medical advice. Live global rankings, real user matching, food recognition, AI services, wearable imports, payments, and production deployment need backend services, credentials, and privacy/security review. No provider secrets are stored in this frontend.

