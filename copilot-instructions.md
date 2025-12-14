# How Copilot Should Work Here

Goal: Follow project conventions to add pages/features that integrate cleanly without rework.

## Tech Context
- Shadcn UI, Tailwind, React, Vite.
- Routing: `createBrowserRouter` in `src/routes/browserRouter.tsx`.
- Admin protection: routes under `<RequireAuth><Layout /></RequireAuth>`.
- Data: `http` from `src/utils/http.tsx` or `src/lib/utils.ts` with React Query (`useQuery`, `useMutation`).
- State: Redux slices in `src/store/slices` for shared/multi‑step logic.
- i18n: Strings in `src/locales/{en,fr,...}` via i18next.
- Types: Interfaces in `src/interfaces`, enums in `src/interfaces/enum`.

## Public Page Flow
1. Create page under `src/pages/...`.
2. Add lazy import in `src/routes/browserRouter.tsx` using `loadable` with `fallbackElement`.
3. Register route with a path from `webRoutes`.
4. If needed, add backend path in `apiRoutes`.

## Admin (Dashboard) Page Flow
1. Create page under `src/pages/dashboard/...`.
2. Register as a child under `<RequireAuth><Layout /></RequireAuth>` in `src/routes/browserRouter.tsx`.
3. Add a side link in `src/data/sidelinks.tsx` with role‑based visibility.
4. Add entries in `webRoutes` and `apiRoutes` when applicable.

## Domain CRUD Convention
Implement in this order: `index` (list/data table) → `data-table` → `columns` → `add` (create) → `edit` (update) → `view` (read‑only) → `details` (optional).

## Data Fetching Patterns
- Query: `useQuery({ queryKey: ['resource'], queryFn: () => http.get(apiRoutes.resource) })`.
- Mutation: `useMutation({ mutationFn: (payload) => http.post(apiRoutes.resourceCreate, payload) })`; on success, invalidate related queries.

## Files & Structure
- New pages in `src/pages/...` (admin pages under `dashboard/...`).
- Shared components in `src/components/...`.
- Domain subcomponents (e.g., data‑table, columns) colocated with the domain page folder.

## UI & Styling
- Prefer Shadcn components from `src/components/ui`.
- Use Tailwind; keep CSS in `index.css` or component‑local files.

## Error Handling & Loading
- Use global `ErrorPage` and `ProgressBar` in routes.
- Prefer optimistic UI and query error boundaries.

## Required Outputs For Any Feature
- Page files created in the correct location.
- Routes registered (public/admin) and paths added to `webRoutes`/`apiRoutes`.
- Admin side link with roles (if dashboard).
- Data wired via `http` + React Query; mutations invalidate cache.
- All UI text in `src/locales`; consumed via i18next.
- Interfaces/enums defined under `src/interfaces`.
- Use Shadcn UI components; style via Tailwind/local CSS.

