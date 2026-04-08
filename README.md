# Cally 🍽️

A curated food inspiration and recipe collection app with calorie tracking.

## About

Cally lets you browse and manage a personal collection of recipes. Each recipe includes a title, description, category, ingredients, step-by-step directions, estimated calories, and an optional photo. Anyone can browse the collection, while a password-protected admin area allows adding, editing, and deleting recipes.

## Tech Stack

- **[Nuxt 3](https://nuxt.com/)** — Vue 3 full-stack framework
- **[Supabase](https://supabase.com/)** — PostgreSQL database + file storage
- **[TailwindCSS](https://tailwindcss.com/)** — Styling
- **[Vercel](https://vercel.com/)** — Deployment

## Vibe Coded with Claude

This project is entirely vibe coded with [Claude](https://claude.ai/) as a personal experiment to learn and master AI-assisted development. No line of code was written manually — the goal was to explore how far you can get by collaborating with an AI from architecture to a working product.

## Getting Started

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example env file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_KEY` | Your Supabase anon/public key |
| `NUXT_PUBLIC_ADMIN_EMAIL` | Email used for the admin account |
