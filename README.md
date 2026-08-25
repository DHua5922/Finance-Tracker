[![Continuous Integration](https://github.com/DHua5922/Finance-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/DHua5922/Finance-Tracker/actions/workflows/ci.yml)

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
- [Accessibility testing process](#accessibility-testing-process)
- [Code quality](#code-quality)
- [Deployment](#deployment)
- [Lessons learned](#lessons-learned)

## Features

- Create an account and log in.
- Reset a forgotten password by email.
- Stay logged in while the session is valid.
- Refresh an expired access token once before returning to the login page.
- Open the account menu to view the username and email, visit the profile, or
  log out.
- Update the profile username and email.
- Close an account after confirming the permanent action.
- View income, expense, and net savings totals on the dashboard.
- View income and expenses together on the protected transactions page.
- Add, edit, and delete transactions.
- Search transactions by name or description.
- Filter transactions by type and frequency.
- Switch between light and dark themes.
- Use the sidebar on desktop or the navigation menu on mobile screens.
- Remove a closed user's transactions in the background with Inngest.

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
- [Axe](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) for browser accessibility checks
- [Inngest](https://www.inngest.com/) for background jobs
- [Resend](https://resend.com/) for password reset emails
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
APP_BASE_URL=http://localhost:3000
AUTH_API_BACKEND_BASE_URL=http://localhost:8080
DATABASE_URL=postgresql://username:password@localhost:5432/finance_tracker
RESEND_API_KEY=your_resend_api_key
```

`APP_BASE_URL` is the frontend address. Password reset emails use it to build
their reset link. Playwright also uses it as the default address for browser
tests.

`AUTH_API_BACKEND_BASE_URL` is the address of the authentication service. If it
is not set, the app uses `http://localhost:8080`.

`DATABASE_URL` is required. It must point to the PostgreSQL database used for
dashboard and transaction data.

`RESEND_API_KEY` is required when sending password reset emails.

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
│   ├── profile/         Profile updates, account closure, and cleanup data
│   ├── transaction/     Transaction UI, actions, database access, and tests
│   └── transaction-frequency/  Transaction frequency data and controls
├── inngest/             Background job definitions
└── shared/              Shared components, APIs, database setup, tests, and tools
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

When a user closes an account, the app clears the session cookies. An Inngest
event then removes that user's transaction data in the background.

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
| `pnpm test:accessibility` | Checks accessibility with Playwright and Axe. |
| `pnpm size` | Builds the app and checks the JavaScript size limit. |

## Automated Testing

The test suite is split by purpose:

- Unit tests check small functions on their own.
- Component tests check UI behavior and accessibility.
- Integration tests check how features work across their main parts. HTTP calls
  use MSW, so tests do not depend on a live auth service.
- End-to-end tests check important user flows in a browser: authentication, dashboard, and transaction management.
- Accessibility tests use Axe in Chromium. They check the dashboard,
  transaction page, and add-transaction form against WCAG 2.0, 2.1, and 2.2
  Level A and AA rules.

Run all local test groups with:

```bash
pnpm test:unit
pnpm test:component
pnpm test:integrations
pnpm test:e2e
pnpm test:accessibility
```

GitHub Actions also runs quality checks, bundle size checks, and test jobs.

## Accessibility testing process

Automated checks are useful, but they cannot find every accessibility problem.
Use both automated and manual testing before releasing an important UI change.

### Building accessible pages and components

Use this process while designing and building the UI:

1. Start with semantic HTML. Use the correct heading levels and elements such
   as `header`, `nav`, `main`, `section`, `button`, and `a`.
2. Use native controls when possible. A button should perform an action, while
   a link should take the user to another page.
3. Give every control an accessible name. Connect form labels to their inputs
   and add clear names to icon-only buttons.
4. Make every action work with a keyboard. Do not require a mouse, hover, drag,
   or touch gesture as the only way to complete a task.
5. Keep focus visible. When a menu or dialog opens, move focus when needed,
   contain it when appropriate, and return it to the opening control on close.
6. Use ARIA only when native HTML cannot describe the behavior. Keep states
   such as `aria-expanded`, `aria-controls`, `aria-invalid`, and `aria-busy`
   accurate.
7. Make validation errors specific and connect them to the affected fields.
   Announce important errors, loading states, and success messages.
8. Check text, borders, controls, charts, and focus indicators for enough color
   contrast in both light and dark themes. Do not use color as the only way to
   communicate meaning.
9. Support zoom, small screens, text wrapping, and reduced motion. Content must
   remain readable without controls overlapping or becoming unavailable.
10. Add component tests for keyboard behavior and accessible names. Add an axe
    browser test for important pages and workflows, then complete the manual
    checks below.

### Automated checks

Run the Playwright and axe-core tests:

```bash
pnpm test:accessibility
```

These tests currently scan the dashboard, transaction page, and transaction
form for WCAG 2.0, 2.1, and 2.2 Level A and AA violations.

### Manual checks

Check the changed pages in both light and dark themes:

1. Run the Accessibility report in Lighthouse. Review every warning instead of
   relying only on the score.
2. Scan the page with the axe DevTools browser extension. Test the normal page
   and open states such as menus, sidebars, and dialogs.
3. Use only the keyboard. Confirm that Tab and Shift+Tab follow a clear order,
   Enter and Space activate controls, Escape closes overlays, and focus remains
   visible.
4. Confirm that focus moves into an opened dialog or menu and returns to the
   control that opened it after closing.
5. Test with a screen reader. Use VoiceOver on macOS or iOS, NVDA on Windows,
   or Orca on Linux. Check headings, landmarks, form labels, error messages,
   buttons, links, and status updates.
6. Zoom the browser to 200% and confirm that content remains readable and no
   important controls are hidden or overlap.

Record any issue with the page, browser, test tool, steps to reproduce, and the
expected result. Automated axe and Lighthouse results do not replace keyboard
or screen-reader testing.

## Code quality

Before opening a pull request, run:

```bash
pnpm quality:check
pnpm test:unit
pnpm test:component
pnpm test:integrations
pnpm test:accessibility
```

The production JavaScript limit is 300 KB for the files matched by the bundle
size check. Heavy client features, such as dashboard charts, are loaded only
when they are needed.

## Deployment

The app can be deployed to any service that supports Next.js and Node.js. Vercel
is one option.

Before deployment:

1. Add `APP_BASE_URL`, `AUTH_API_BACKEND_BASE_URL`, `DATABASE_URL`, and
   `RESEND_API_KEY` to the hosting service.
2. Make sure the app can reach the auth service and PostgreSQL database.
3. Configure the Inngest signing and event keys when using hosted Inngest. If you connect Inngest to the GitHub repository directly, the signing and event keys are automatically set as `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` in environment variables on Vercel for preview and production environments for that GitHub repository.
4. Run `pnpm build` to check the production build.
5. Run `pnpm start` to serve the built app when the host requires it.

See the [Next.js deployment guide](https://nextjs.org/docs/app/getting-started/deploying)
for more options.

## Lessons learned

Write unit, component, and integration tests while the app is changing. Add
end-to-end tests after the main user flow is stable. End-to-end tests take more
work to update when pages and flows change often.
