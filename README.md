# ElsadiqRCPCH

Original MRCPCH question bank: React + TypeScript + Vite frontend, Supabase (Postgres + Auth) backend.

## Run locally

```bash
npm install
npm run dev
```

The app runs in demo mode on bundled seed data when no Supabase keys are present.

## Connect Supabase

1. Create a free project at supabase.com.
2. In the SQL Editor, run `supabase/schema.sql`.
3. Create `.env` with:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```

Only the anon key goes in the frontend. Never commit service-role keys.

## Build and deploy (GitHub Pages)

```bash
npm run build
```

Output lands in `dist/`. The Vite `base` is set to `/ElsadiqRCPCH/`.

## Content status

All questions and articles are original drafts pending clinical review.
Primary reference: NICE CG98, Jaundice in newborn babies under 28 days (updated Oct 2023).
