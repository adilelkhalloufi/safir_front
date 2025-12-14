AI Contribution Guidelines
These instructions codify how to add features and pages in this project so any AI assistant works exactly within your conventions.

Overview
UI stack: Shadcn UI + Tailwind + React + Vite.
Routing: react-router-dom with createBrowserRouter in src/routes/browserRouter.tsx.
Auth layout: Protected admin routes are wrapped by RequireAuth + Layout.
Data: Fetch via custom http utilities + useQuery (React Query). Persist/shared logic via Redux slices in src/store.
i18n: All text lives under src/locales and is consumed via i18next.
Types: Every domain model has interfaces under src/interfaces.
Routes: Define both web and api route entries.
Navigation: Admin menu items via src/data/sidelinks.tsx with role-based visibility.
When asked to create a page
1) Decide route type
Public page:

Create page under src/pages/....
Add a lazy import in src/routes/browserRouter.tsx using loadable and fallbackElement:
Example: const Login = loadable(() => import('../pages/auth/sign-in'), { fallback: fallbackElement });
Register it inside createBrowserRouter with path from webRoutes.
Add its entry in webRoutes (and api if it needs a backend route).
Admin (dashboard) page:

Create page under src/pages/dashboard/....
Ensure route is a child under the protected RequireAuth + Layout in src/routes/browserRouter.tsx.
Add a menu item in src/data/sidelinks.tsx and define role permissions to control visibility.
Add entries in webRoutes and api as applicable.
2) Dashboard CRUD flow conventions
For a domain like users, implement in this order:

index: List page using a data table.
data-table: Shared table component for the domain.
columns: Column definitions for the table.
add: Create form page.
edit: Update form page.
view: Read-only page.
details (optional): Only if the model requires deeper drill-down.
3) Data fetching & state
HTTP: Use the custom http utilities in src/utils/http.tsx or src/lib/utils.ts, not fetch directly.
Queries: Wrap requests with useQuery (React Query). One query per resource or view; include sensible queryKeys.
Mutations: Use corresponding mutation hooks; update cache appropriately.
Redux: For complex/shared logic (e.g., cart, multi-step process), create a slice in src/store/slices. Expose actions to set and update state. Wire to components via the store in src/store/index.tsx.
4) Internationalization
Place all display strings in src/locales, under language folders (en, fr).
Refer to strings via i18next in components; avoid hardcoded text in JSX.
5) Interfaces (Types)
Define model interfaces under src/interfaces with clear types and enums (see src/interfaces/enum).
Import and use interfaces in pages, hooks, and Redux slices.
6) Shadcn UI & styling
Use Shadcn components in src/components/ui where possible.
Follow existing component patterns in src/components for custom pieces.
Keep styling in index.css, component-local CSS, or Tailwind classes; avoid ad-hoc global styles.
7) Routing setup details
Public:

Add lazy import:
const MyPage = loadable(() => import('../pages/...'), { fallback: fallbackElement });
Register in createBrowserRouter with path: webRoutes.myPage.
Admin:

Place route under the children of the protected block:
element: (<RequireAuth><Layout /></RequireAuth>).
Add corresponding side link with role constraints in sidelinks.tsx.
8) Routes definition
Add the route path in src/routes/web.tsx for frontend navigation.
Add the backend endpoint path in src/routes/api.tsx for fetch calls.
9) Fetch examples
Query example:
Use useQuery({ queryKey: ['users'], queryFn: () => http.get(apiRoutes.users) }) and map data to the table.
Mutation example:
Use useMutation({ mutationFn: (payload) => http.post(apiRoutes.usersCreate, payload) }) and on success invalidate related queries.
10) Files & structure
Place new pages in src/pages/... following existing folder naming.
Shared components go under src/components/....
Domain-specific subcomponents (e.g., data-table, columns) live alongside the page in a domain folder.
11) Error handling & loading
Use the global ErrorPage and ProgressBar for errorElement and fallback in routes.
Prefer optimistic UI and query error boundaries where relevant.
12) What the AI should do on request
When asked to “create a page/feature,” the AI should:

Identify if it’s public or admin.
Create the page files following the CRUD step order when applicable.
Add lazy imports and register routes in createBrowserRouter.
Update webRoutes and apiRoutes.
For admin, update sidelinks with roles.
Implement fetches using useQuery/mutations via the custom http object.
Add all text to locales and consume via i18next.
Add or update Redux slices for any multi-step/process logic.
Define/update interfaces for the model.
Use Shadcn UI components and follow existing styles.
By following these guidelines, assistants will consistently align with the project’s architecture and conventions, minimizing rework and ensuring features are delivered in a way that integrates cleanly.

 