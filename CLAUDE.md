# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cally** is a recipe collection web app built with Nuxt 3 (Vue 3 + TypeScript). Users browse and filter recipes; admins can create, edit, and delete them via a password-protected area. Backend is Supabase (PostgreSQL + file storage). Deployed on Vercel.

## Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run generate    # Generate static site
npm run preview     # Preview production build locally
```

No test or lint scripts are configured.

## Environment Setup

Copy `.env.example` to `.env` and populate:
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_KEY` — Supabase anon/public key
- `NUXT_PUBLIC_ADMIN_EMAIL` — Admin email for authentication

## Architecture

### Routing & Layouts

Nuxt file-based routing. Two layouts:
- `layouts/default.vue` — public pages (Header + Footer)
- `layouts/admin.vue` — admin pages (AdminNav)

Route middleware `middleware/auth.ts` redirects unauthenticated users away from `/admin/**`.

### Data & State (Composables)

All Supabase interaction is encapsulated in composables:
- `composables/useRecipes.ts` — CRUD for recipes + image upload to `recipe-images` bucket
- `composables/useAuth.ts` — login/logout, `isAdmin` computed
- `composables/useCategories.ts` — category list

### Type System

`types/recipe.ts` defines the core types: `Recipe`, `Ingredient`, and the category constants. The `ingredients` field is stored as JSONB in Supabase; `directions` is a `text[]` array.

### Database

`supabase-setup.sql` contains the full schema: `recipes` table with RLS (public read, authenticated write), an `updated_at` trigger, and storage bucket setup.

### Styling

TailwindCSS with a custom palette defined in `tailwind.config.ts`:
- **cream** — warm background tones
- **spice** — orange-brown accent
- **herb** — green accent
- **charcoal** — dark text

Fonts: "Playfair Display" (headings) and "Lato" (body), loaded via Google Fonts in `nuxt.config.ts`. Shared component styles (buttons, form inputs, cards, pills) live in `assets/css/main.css`.
