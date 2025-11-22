# Next.js Architecture & Data Rules

## 1. Component Strategy

- Use **Server Components by default** for SEO, security, and performance.
- Use **Client Components only** when local interactivity, event handling, or browser APIs are required.
- Split logic: data fetching and heavy computation on the **server**, lightweight interactivity on the **client**.

## 2. Data Fetching Principles

- **Fetch data server-side** with `fetch()` inside Server Components or dedicated server utilities.
- Mark API routes or fetch calls with proper caching policy (`cache: 'no-store'`, `revalidate`, etc.).
- Use **`Promise.all`** for parallel requests to minimize waiting time.
- Use **Suspense** boundaries to progressively stream slow sections instead of blocking the entire page.

## 3. Data Sharing & Reuse

Use one of these strategies depending on your needs:

1. **Server Context + `use()`**
   - Create a React Context provided in a server layout.
   - Fetch server data and pass the promise; child components can call `use(contextValue)` to suspend until it resolves.
   - Ideal for global data like user/session.

2. **`cache()` for server function memoization**
   - Wrap fetchers with `cache()` to reuse results across multiple components within the same request.
   - Prevents duplicate API calls and avoids prop drilling.

   ```ts
   import { cache } from 'react';

   export const getUser = cache(async () => {
     const res = await fetch(`${process.env.API_URL}/api/users/me`, { cache: 'no-store' });
     return res.json();
   });
   ```

   Then in any server component:

   ```tsx
   const user = await getUser(); // Cached across components during SSR
   ```

3. **Prop drilling only for scoped data**
   - Pass data through props only when it’s local to a small component tree.
   - Never pass global or reused data through multiple component layers.

4. **Client cache (SWR)**
   - Use for client-only interactions (filters, infinite scroll, form-dependent data).
   - Import a config utility instead of wrapping the app in `<SWRConfig>` to avoid marking the tree as client.

## 4. Performance Optimization

- Use **`cache()`** to deduplicate server requests within a single render.
- Use **Suspense boundaries** to parallelize slow sections.
- Avoid making data fetching dependent on client state unless necessary.
- Enable **static generation** (`revalidate`) for public, rarely changing data.

## 5. Providers & State Management

- Keep all global providers (e.g. modals, toasts) **at the root client boundary**, but outside the main layout if possible.
- Avoid wrapping the entire app with client-only providers.
- Prefer isolated client islands for features like modals, rather than turning large layout sections into client components.

## 6. Caching Rules

- Use `fetch(..., { cache: 'no-store' })` for dynamic/private data.
- Use `fetch(..., { next: { revalidate: 60 } })` for semi-static data.
- Use `cache()` for memoized server utilities.
- Never rely on SWR or client caching for SEO-critical data.

## 7. Quick Rules

- **Default:** Server Component.
- **Need interactivity:** Client Component.
- **Data reused in multiple places:** `cache()` or Server Context.
- **Client dynamic UI (filters, forms):** SWR.
- **Global state/UI (modals, toasts):** Minimal client provider at root.
- **Multiple APIs per page:** Fetch in parallel + Suspense boundaries.

This structure ensures **SEO performance**, **data reuse**, and **code isolation** without compromising on rendering speed or maintainability.
