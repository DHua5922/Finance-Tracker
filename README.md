# Finance Tracker

Finance Tracker is a web app for tracking income and expenses in one place. It
gives each user a private dashboard with totals for income, expenses, and net
savings.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Install the project](#install-the-project)
  - [Set environment variables](#set-environment-variables)
  - [Start the app](#start-the-app)
- [Project structure](#project-structure)
- [How authentication works](#how-authentication-works)
- [Scripts](#scripts)
- [Automated Testing](#automated-testing)
- [Code quality](#code-quality)
- [Deployment](#deployment)
- [Lessons learned](#lessons-learned)

## Features

- Create an account and log in.
- Stay logged in while the session is valid.
- Refresh an expired access token once before returning to the login page.
- Log out from the private header or mobile menu.
- View income, expense, and net savings totals on the dashboard.
- View income and expenses together on the protected transactions page.
- Add, edit, and delete transactions.
- Search transactions by name or description.
- Filter transactions by type and frequency.
- Switch between light and dark themes.
- Use the sidebar on desktop or the navigation menu on mobile screens.

## Tech stack

- [Next.js](https://nextjs.org/) with the App Router
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) and CSS Modules
- PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- [Zod](https://zod.dev/) for data checks
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Mock Service Worker](https://mswjs.io/)
- [Playwright](https://playwright.dev/)
- [Biome](https://biomejs.dev/)

## Getting started

### Requirements

Install these tools before you begin:

- Node.js 24 or newer
- pnpm 11.20.0 or newer
- A PostgreSQL database
- The authentication API used by this app

### Install the project

```bash
git clone <repository-url>
cd finance-tracker
pnpm install
```

### Set environment variables

Create a `.env` file in the project root:

```dotenv
AUTH_API_BACKEND_BASE_URL=http://localhost:8080
DATABASE_URL=postgresql://username:password@localhost:5432/finance_tracker
```

`AUTH_API_BACKEND_BASE_URL` is the address of the authentication service. If it
is not set, the app uses `http://localhost:8080`.

`DATABASE_URL` is required. It must point to the PostgreSQL database used for
dashboard and transaction data.

Do not commit `.env` files. They may contain private values.

### Start the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Project structure

```text
src/
├── app/                 Next.js pages, layouts, and route handlers
│   └── (protected)/     Pages that require a valid user session
├── features/            Code grouped by app feature
│   ├── auth/            Login, sign-up, session, and auth tests
│   ├── dashboard/       Dashboard UI, database access, and tests
│   ├── landing/         Public home page UI
│   ├── transaction/     Transaction UI, actions, database access, and tests
│   └── transaction-frequency/  Transaction frequency data and controls
└── shared/              Shared components, database setup, tests, and tools
```

Pages and layouts are server components by default. Client components are used
only when browser state, effects, or click handlers are needed. This keeps the
browser bundle small.

Feature code stays inside its feature folder. Tests and styles are kept close
to the code they cover.

## How authentication works

The app stores access and refresh tokens in secure, HTTP-only cookies. Protected
pages check the access token on the server.

If the access token has expired, the app tries to refresh it once. A successful
refresh keeps the user signed in. If the refresh fails, the user returns to the
login page.

The home page sends signed-in users to the dashboard.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Starts the local development server. |
| `pnpm build` | Creates a production build. |
| `pnpm start` | Starts the production build. |
| `pnpm lint` | Checks formatting and code rules with Biome. |
| `pnpm format` | Fixes supported Biome issues. |
| `pnpm typescript:check` | Checks TypeScript types. |
| `pnpm check:unused` | Finds unused files, exports, and packages. |
| `pnpm quality:check` | Runs lint, unused-code, and TypeScript checks. |
| `pnpm test:unit` | Runs unit tests. |
| `pnpm test:component` | Runs component tests. |
| `pnpm test:integrations` | Runs integration tests. |
| `pnpm test:e2e` | Runs end-to-end tests with Playwright. |
| `pnpm size` | Builds the app and checks the JavaScript size limit. |

## Automated Testing

The test suite is split by purpose:

- Unit tests check small functions on their own.
- Component tests check UI behavior and accessibility.
- Integration tests check how features work across their main parts. HTTP calls
  use MSW, so tests do not depend on a live auth service.
- End-to-end tests check important user flows in a browser.

Run all local test groups with:

```bash
pnpm test:unit
pnpm test:component
pnpm test:integrations
pnpm test:e2e
```

GitHub Actions also runs quality checks, bundle size checks, and test jobs.

## Code quality

Before opening a pull request, run:

```bash
pnpm quality:check
pnpm test:unit
pnpm test:component
pnpm test:integrations
```

The production JavaScript limit is 200 KB for each file matched by the bundle
size check.

## Deployment

The app can be deployed to any service that supports Next.js and Node.js. Vercel
is one option.

Before deployment:

1. Add `AUTH_API_BACKEND_BASE_URL` and `DATABASE_URL` to the hosting service.
2. Make sure the app can reach the auth service and PostgreSQL database.
3. Run `pnpm build` to check the production build.
4. Run `pnpm start` to serve the built app when the host requires it.

See the [Next.js deployment guide](https://nextjs.org/docs/app/getting-started/deploying)
for more options.

## Lessons learned

Write unit, component, and integration tests while the app is changing. Add
end-to-end tests after the main user flow is stable. End-to-end tests take more
work to update when pages and flows change often.
