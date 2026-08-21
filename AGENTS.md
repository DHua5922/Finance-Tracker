<!-- BEGIN:nextjs-agent-rules -->

# Project Rules for GitHub Copilot & Codex

- **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS, CSS Modules.
- **RSC Default**: Every page or layout is a React Server Component by default. Do not add 'use client' unless explicitly handling state hooks (useState), lifecycle hooks (useEffect), or DOM event handlers.
- **Async Routing**: In this version of Next.js, `params` and `searchParams` in pages/layouts are Promises. You MUST `await` them before reading their properties.
- **Component Colocation**: Keep sub-components, tests, and styles right next to the page route folder. Do not create a global `/components` folder unless the element is universally shared.
- **Clean Completions**: Avoid writing legacy React.FC types. Favor native TypeScript props destructured inline. Move long classnames to CSS modules
- **File Structure**: Use feature based file structure
- **Code Structure**: Place variable names and functions where it is easy to read. if a file becomes too long, break it up. In component files, place types at the top, then variables, then main component being exported, and then helper functions. If function or variable is being used only once in 1 place, place it as close as possible without sacrificing readability.

<!-- END:nextjs-agent-rules -->
