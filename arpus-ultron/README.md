# Arpus-Ultron

Business control panel — clients, accounts, projects, sheets, tasks, workers.

## Stack
- **React 18** + Vite
- **Supabase** — Postgres database + Auth (coming)
- **Lucide React** — icons

## Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/arpus-ultron.git
cd arpus-ultron

# 2. Install
npm install

# 3. Environment
cp .env.example .env
# Fill in your Supabase URL and anon key in .env

# 4. Database — run supabase_schema.sql in Supabase SQL Editor

# 5. Dev server
npm run dev
```

## Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Your Project → **SQL Editor**
2. Paste the contents of `supabase_schema.sql` and click **Run**
3. Copy your **Project URL** and **Anon Key** from Settings → API
4. Add them to your `.env` file

## Folder Structure

```
arpus-ultron/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── App.jsx          ← Main app (all UI)
│   ├── hooks/
│   │   └── useSupabase.js   ← Data sync hook
│   ├── lib/
│   │   └── supabase.js      ← DB client + helpers
│   └── main.jsx
├── supabase_schema.sql       ← Run this in Supabase
├── .env.example              ← Copy to .env
├── index.html
├── package.json
└── vite.config.js
```

## Security Note

- Keep `.env` out of git (it's in `.gitignore`)
- Rotate your Supabase anon key from the dashboard if it was ever shared publicly
- Tighten Row Level Security policies before production use
