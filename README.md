# SecureTrack — Frontend

Next.js (App Router) client for SecureTrack, a vulnerability/incident
report tracking system with JWT authentication and 4 user roles: User,
Analyst, Developer, Admin.

Paired backend: https://github.com/ShahreerIrfan/securetrack-backend

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Zustand (auth state)
- axios (with 401-refresh interceptor)
- recharts

## Local setup

```bash
npm install
npm run dev
```

Runs at `http://localhost:3000`. Talks to a backend at
`http://localhost:8000/api` by default - see below to point it elsewhere.

## Environment variables

| Variable | Local default | Set in production to |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` | your deployed backend's `/api` URL |

Copy `.env.example` to `.env.local` for local overrides. This is the only
environment variable the app reads.

## Deployment (Vercel)

1. Import this repo into Vercel - the Next.js framework preset is
   auto-detected, no build configuration needed.
2. In Project Settings → Environment Variables, set `NEXT_PUBLIC_API_URL`
   to the deployed backend's API URL (e.g. `https://api.yourdomain.com/api`)
   for Production, Preview, and Development.
3. Deploy. On the backend, make sure `CORS_ALLOWED_ORIGINS` includes this
   project's Vercel domain(s) (and any custom domain you attach) - see the
   backend README.

`NEXT_PUBLIC_*` variables are baked in at build time, so changing this
value in Vercel requires a redeploy to take effect.
