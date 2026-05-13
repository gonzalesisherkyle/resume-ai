# ResumeAI Frontend

React/Vite frontend for the ResumeAI resume builder. It provides the authenticated editor, resume preview, ATS score view, job analyzer, public resume pages, exports, sharing controls, and AI chat surface.

## Tech Stack

- React 19
- Vite 8
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

## Prerequisites

- Node.js 20 or newer recommended
- npm or pnpm
- The backend API running locally, usually at `http://127.0.0.1:5000`

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server runs on:

```text
http://localhost:5173
```

## Environment

Create `.env` from `.env.example`.

```env
VITE_API_URL=/api
VITE_PROXY_TARGET=http://127.0.0.1:5000
```

`VITE_API_URL` controls the Axios base URL. In local development it defaults to `/api`, which is proxied by Vite.

`VITE_PROXY_TARGET` points the Vite dev proxy at the backend API.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run deploy
```

`npm run deploy` builds the app and deploys `dist` with Wrangler Pages.

## Main Routes

- `/login` - sign in
- `/register` - create an account
- `/dashboard` - resume list
- `/resume/:id` - resume editor
- `/score/:id` - ATS score view
- `/job-analyzer` - job description analyzer
- `/share/:shareId` - public read-only resume

## Development Notes

- Auth tokens are stored in `localStorage`.
- Requests are made through `src/api/axios.js`.
- Protected pages redirect unauthenticated users to `/login`.
- Resume preview rendering lives in `src/components/resume/ResumePreview.jsx`.
- Resume editing lives in `src/components/resume/ResumeForm.jsx`.

## Build

```bash
npm run build
```

The production output is written to `dist`.

## Troubleshooting

- If API calls fail locally, confirm the backend is running and `VITE_PROXY_TARGET` matches the backend URL.
- If auth redirects unexpectedly, clear `localStorage` and log in again.
- If Vite cannot use port `5173`, stop the existing process or run Vite with another port.
