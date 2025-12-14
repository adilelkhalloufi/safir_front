# SAFIR_FRONT – AI Coding Agent Instructions

Purpose: Make AI agents immediately productive by codifying key architecture, workflows, and project-specific conventions. Keep changes minimal and aligned with existing patterns.

## Architecture & Key Files
- UI stack: React + Vite + Tailwind + Shadcn UI.
- Routing: `src/routes/browserRouter.tsx` uses `createBrowserRouter` with lazy-loaded pages and `fallbackElement`.
- Auth: Protected admin routes are wrapped by `RequireAuth` and `Layout` in `src/routes/browserRouter.tsx`; gate access with `src/routes/requireAuth.tsx`.
- Layout: Admin shell in `src/components/layout/index.tsx` with nav/sidebar components.
- Data: HTTP via `src/utils/http.tsx` and helpers in `src/lib/utils.ts`. Prefer `useQuery`/`useMutation` (React Query) for data lifecycle.
- State: Redux store in `src/store/index.tsx`; domain slices under `src/store/slices/`.
- i18n: Strings in `src/locales/{en,fr,ar}`; use `i18next` from `src/i18n.tsx`.
- Types: Interfaces and enums under `src/interfaces/**`.
- Routes registry: Frontend paths in `src/routes/web.tsx`; API endpoints in `src/routes/api.tsx`.
- Navigation: Admin menu config and role visibility in `src/data/sidelinks.tsx`.

## Build, Dev, and Debug
- Dev server: `npm run dev` (Vite). Inspect route fallback via `fallbackElement` in `src/components/loader/progressBar.tsx`.
- Build: `npm run build` → dist; Preview with `npm run preview`.
- Formatting/Linting: Tailwind + Prettier conventions; keep class ordering consistent.

## Page Creation Workflow
1) Decide scope
- Public page: place under `src/pages/landing` or `src/pages/...` and register in `src/routes/browserRouter.tsx` with `webRoutes`.
- Admin page: place under `src/pages/dashboard/...`; register as a child of the protected `RequireAuth + Layout` block; add nav entry in `src/data/sidelinks.tsx` with roles.
2) Lazy load + route
- Example import: `const UsersIndex = loadable(() => import('../pages/dashboard/users/index'), { fallback: fallbackElement });`
- Register path: use `webRoutes.users.index` in `createBrowserRouter`.
3) CRUD domain pattern (admin)
- Folder structure per model: `index` (list), `data-table`, `columns`, `add`, `edit`, `view`, `details` (optional).
4) Data access
- Queries: `useQuery({ queryKey: ['users'], queryFn: () => http.get(apiRoutes.users) })`.
- Mutations: `useMutation({ mutationFn: (payload) => http.post(apiRoutes.usersCreate, payload) })`, then invalidate related query keys.
- Never call `fetch` directly; use `http` utilities.
5) State & side effects
- Shared/long-lived flow: create/update Redux slice in `src/store/slices`, wire via `src/store/index.tsx`.
6) Internationalization
- Put all UI text in `src/locales/*`; consume via `i18next` (avoid hardcoded JSX strings).
7) Types
- Define model interfaces/enums in `src/interfaces/**`; import types in pages/hooks/slices.
8) UI & Styles
- Prefer Shadcn components from `src/components/ui/**`; use Tailwind classes; keep global styles in `src/index.css` or component-local CSS.

## Integration & Cross-Cutting
- Top nav/sidebar: `src/components/top-nav.tsx`, `src/components/sidebar.tsx`; maintain active state via hooks in `src/hooks/**`.
- Theme: `src/components/theme-provider.tsx`, `src/components/theme-switch.tsx`.
- Auth layout: `src/components/auth/AuthLayout.tsx` and `src/pages/auth/Login.tsx`.
- Common components: `src/components/custom/**` and `src/components/loader/**` for progress/error UX.

## Conventions to Follow
- Routing names come from `webRoutes`/`apiRoutes` files; do not inline strings.
- One React Query per resource/view; sensible `queryKey` naming.
- Role-based visibility for admin links via `src/data/sidelinks.tsx`.
- Localized strings only; avoid hardcoded text.
- Keep new files colocated by domain and follow existing directory naming.

## Examples
- Query list page: use `http.get(apiRoutes.users)` in `useQuery`, render with a domain `data-table` and `columns` alongside `index.tsx`.
- Mutation create page: form submits via `useMutation` calling `http.post(apiRoutes.usersCreate)`; on success, invalidate `['users']` and navigate using `webRoutes`.
- Add a menu item: edit `src/data/sidelinks.tsx` with `{ path: webRoutes.users.index, label: t('users.menu'), role: 'admin' }`.

## What AI Should Do When Asked "Add X"
- Determine page type (public/admin) and domain.
- Create page files and CRUD subfiles as needed.
- Wire lazy import + route in `src/routes/browserRouter.tsx`.
- Update `src/routes/web.tsx` and `src/routes/api.tsx`.
- For admin, update `src/data/sidelinks.tsx` with role visibility.
- Implement data with React Query through `http` utilities.
- Add strings to `src/locales/*` and consume via `i18next`.
- Define types in `src/interfaces/**`; create Redux slice if multi-step/shared state.
- Use Shadcn UI and Tailwind with existing patterns.

If anything here seems incomplete or unclear (e.g., exact `queryKey` naming, fallback components, or role schema), tell us which section to refine and we’ll iterate.
