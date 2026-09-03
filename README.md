# SecureTrack — Frontend

Next.js (App Router) frontend for SecureTrack, a vulnerability/incident
report tracking system with JWT authentication and 4 user roles: User,
Analyst, Developer, Admin.

Paired backend: https://github.com/ShahreerIrfan/securetrack-backend

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Zustand (auth state, persisted to localStorage)
- axios (with a refresh-on-401 interceptor)
- recharts (dashboard charts)

## Local setup

The backend must be running first — see its own README for setup
(`python manage.py runserver`, default `http://localhost:8000/`).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Register an account
from the UI, or use a superuser created on the backend (promoted to
`role="admin"` per the backend README) to log in with full access.

## Environment variables

Copy `.env.example` to `.env.local` and adjust if your backend isn't on
the default local address:

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | Base URL the frontend calls for the backend API. Public (`NEXT_PUBLIC_`) because it's used from the browser, and is baked into the client bundle at build time — set it before `npm run build` for a non-local deploy, not after. |

No other environment variables are required; there are no other secrets
on the frontend (the JWT itself lives in the browser's localStorage, not
in build-time config).

## Structure

```
src/
  app/            routes only - pages compose components, no raw markup
  components/
    ui/           theme-agnostic primitives (Button, Table, Modal, ...)
    layout/       Navbar/Footer (marketing) and Sidebar/Topbar (dashboard)
    marketing/    homepage/contact/features sections
    auth/         AuthForm, ProtectedRoute
    reports/      report-domain components (form, table, badges, actions)
    dashboard/    shared building blocks for all 4 role dashboards
    accounts/     admin user-management components
  lib/            api client, error helpers
  store/          Zustand auth store
  types/          shared TypeScript types matching the backend's API shape
```

## Build

```bash
npm run build
npm run start
```
