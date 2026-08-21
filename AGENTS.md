<!-- BEGIN:nextjs-agent-rules -->

# Project Rules for GitHub Copilot & Codex

- **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS.
- **RSC Default**: Every page or layout is a React Server Component by default. Do not add 'use client' unless explicitly handling state hooks (useState), lifecycle hooks (useEffect), or DOM event handlers.
- **Async Routing**: In this version of Next.js, `params` and `searchParams` in pages/layouts are Promises. You MUST `await` them before reading their properties.
- **Component Colocation**: Keep sub-components, tests, and styles right next to the page route folder. Do not create a global `/components` folder unless the element is universally shared.
- **Clean Completions**: Avoid writing legacy React.FC types. Favor native TypeScript props destructured inline.
- **File Structure**: Use feature based file structure

<!-- END:nextjs-agent-rules -->
