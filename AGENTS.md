<!-- BEGIN:nextjs-agent-rules -->

# Project Rules for GitHub Copilot & Codex

- **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS, CSS Modules, React Testing Library, vitest, Mock Service Worker.
- **RSC Default**: Every page or layout is a React Server Component by default. Do not add 'use client' unless explicitly handling state hooks (useState), lifecycle hooks (useEffect), or DOM event handlers.
- **Async Routing**: In this version of Next.js, `params` and `searchParams` in pages/layouts are Promises. You MUST `await` them before reading their properties.
- **Component Colocation**: Keep sub-components, tests, and styles right next to the page route folder. Do not create a global `/components` folder unless the element is universally shared.
- **Clean Completions**: Avoid writing legacy React.FC types. Favor native TypeScript props destructured inline.
- **File Structure**: Use feature based file structure
- **Code Structure**: Place variable names and functions where it is easy to read. if a file becomes too long, break it up. In component files, place types at the top, then variables, then hooks (if not too long), then main component being exported, and then helper functions. If function or variable is being used only once in 1 place, place it as close as possible without sacrificing readability.
- **CSS Structure**: Use inline tailwind CSS classnames in HTML5 elements by default. If a tailwind classname is too long or it is doing complex custom animations / interactions, move it to CSS modules and convert to CSS3. For selectors and interactions in CSS modules, use & and nest it. Make sure to account for dark and light mode.
- **API Structure**: Place API calls in `api.ts` file for the feature. If `api.ts` file is too long, split that file into several files and group those files into a folder by noun.
- **Zod Schema Structure**: If schemas are used in more than 1 file for that feature, place it in `schemas.ts`. If schemas.ts is too long, break it into separate files and group them in a single folder called `schemas`.

<!-- END:nextjs-agent-rules -->
