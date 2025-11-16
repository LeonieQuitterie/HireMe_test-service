
# HireMeAI

**HireMeAI** is a small monorepo containing a Next.js frontend and a TypeScript backend for a hiring / candidate dashboard application. It provides a candidate listing, detailed candidate views and dashboards with charts and KPIs — useful as a starting point for recruitment tools, dashboards, or demo projects.

**Status:** Starter project / work in progress

**Main stack:**
- Frontend: `Next.js`, TypeScript, React
- Backend: Node.js, TypeScript (lightweight API)
- Monorepo tooling: `pnpm` (workspaces)

**Table of contents**
- **Project**: Overview and goals
- **Repository layout**: Where to find frontend and backend
- **Prerequisites**: Tools you need locally
- **Getting started**: Install and run the apps
- **Development**: Useful scripts and tips
- **Environment**: Environment variables and config
- **Contributing**: How to add changes
- **License**

**Repository Layout**
- `apps/frontend` — Next.js app (TypeScript, app-router). UI components live under `apps/frontend/components`; pages use the new app directory.
- `apps/backend` — Minimal TypeScript API (entry `apps/backend/src/index.ts`).
- `apps/frontend/data` — local sample data for development (e.g. `candidates.ts`).

Getting a quick view:

- Frontend main entry: `apps/frontend/app/page.tsx`
- Backend main entry: `apps/backend/src/index.ts`

Prerequisites
- Node.js 18+ (or compatible LTS)
- `pnpm` (we use pnpm workspaces for fast installs)

Install dependencies
Run these commands from the repository root (`/`) using PowerShell:

```powershell
npm install -g pnpm
pnpm install
```

Development — run both apps

Start the frontend in dev mode (Next.js):

```powershell
cd apps/frontend
pnpm dev
```

Start the backend in dev mode (if it has a dev script):

```powershell
cd apps/backend
pnpm dev
```

If you'd like to run both concurrently from the repository root, you can open two shells and run the two commands above. Alternatively add a root-level script to orchestrate both (not included by default).

Build & Production

Build the frontend:

```powershell
cd apps/frontend
pnpm build
pnpm start
```

Build the backend (if applicable):

```powershell
cd apps/backend
pnpm build
pnpm start
```

Environment variables
- The frontend and backend may require environment variables for real integrations (API keys, DB URLs). Look for `.env.example` files or add a `.env` in each app if needed.

Repository notes & tips
- This repo uses TypeScript across frontend and backend; check `tsconfig.json` files under each app for compile settings.
- Linting, formatting or test scripts may exist inside each `package.json` — run `pnpm -w` to run workspace-level tasks if configured.
- The frontend includes example components for dashboards and candidate detail views under `apps/frontend/components`.

Contributing
- Fork or branch the repository and open a pull request with a clear description of changes.
- Keep changes small and focused: one feature or fix per PR.
- Add or update tests where appropriate and run linters/formatters before submitting.

Useful commands (summary)
- Install deps: `pnpm install`
- Run frontend dev: `pnpm --filter @apps/frontend dev` (or `cd apps/frontend; pnpm dev`)
- Run backend dev: `cd apps/backend; pnpm dev`
- Build frontend: `cd apps/frontend; pnpm build`

License
- See the `LISENCE` file in the repository root for licensing information.

Further work / TODOs
- Add a top-level `pnpm` script to run both apps in dev concurrently.
- Document environment variables and add `.env.example` files for both apps.
- Add CI workflow for linting, type-check, and tests.

If you want, I can also:
- add `pnpm` root scripts to run both frontend and backend concurrently
- create `.env.example` files with the variables I find in the code
- add a simple GitHub Actions workflow to run type checks and tests

---
If you'd like any of the follow-ups above, tell me which and I'll implement them.
