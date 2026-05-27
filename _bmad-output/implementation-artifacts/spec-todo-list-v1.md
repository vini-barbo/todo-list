---
title: 'TODO List Application - Full Implementation'
type: 'feature'
created: '2026-05-27'
status: 'in-review'
baseline_commit: '201cfbc18a174ed01039cc0f74c5bc5a34f69d48'
context: [
  '{project-root}/_bmad-output/planning-artifacts/architecture.md',
  '{project-root}/_bmad-output/planning-artifacts/business-rules.md',
  '{project-root}/_bmad-output/planning-artifacts/ui-specification.md'
]
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Fresh Next.js boilerplate exists but lacks the TODO list functionality defined in planning artifacts (architecture, business rules, UI specs). Need working CRUD operations, filtering, Supabase integration with mock fallback, and responsive UI matching Sally's design.

**Approach:** Implement data layer (Supabase client + mock fallback), type definitions, server actions for mutations, UI components (task list, task card, filter tabs, forms), and wire everything following Winston's architecture decisions (Server Components for reads, Client Components for interactions).

## Boundaries & Constraints

**Always:**
- Follow Winston's AD-01: Use App Router + Server Components for data fetching
- Follow Winston's AD-02: Supabase direct connection with environment variable toggle
- Follow Winston's AD-03: Mock fallback when `NEXT_PUBLIC_USE_MOCK_DATA=true`
- Follow Winston's AD-04: Tailwind CSS utility-first, no component library
- Follow John's BR-10 validation: Title 1-200 chars (non-whitespace), Description max 1000 chars
- Follow Sally's accessibility requirements: keyboard nav, WCAG AA contrast, semantic HTML
- Path aliases: use `@/` prefix (tsconfig already configured)
- TypeScript strict mode enabled

**Ask First:**
- Any schema changes beyond the defined `todos` table structure
- Adding dependencies not listed in Winston's architecture (currently: only @supabase/supabase-js needed)
- Deviating from BR-04 (irreversible delete) or BR-08 (no auth in v1)

**Never:**
- Don't implement authentication (out of scope for v1 per BR-08)
- Don't add soft-delete/undo (BR-04 defines permanent deletion)
- Don't implement search, tags, priorities, due dates (explicitly out of scope per business rules)
- Don't use component libraries like shadcn/ui (AD-04: manual Tailwind for v1)

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Create task - valid | Title: "Buy milk", Description: "Whole milk" | New task appears at top of list, `completed: false`, generated ID + timestamp | N/A |
| Create task - title empty | Title: "" or whitespace-only | Form submit disabled, inline error "Title required" | Client-side validation prevents submission |
| Create task - title too long | Title: 201+ chars | Inline error "Title must be 1-200 characters" | Client-side validation prevents submission |
| Toggle completion | Click checkbox on pending task | Task gets strikethrough + opacity, state updates to `completed: true`, micro-animation | If Supabase fails, revert UI + show error toast |
| Edit task - inline | Click title, modify text, press Enter | Updated text persists, edit mode exits | ESC cancels without saving |
| Delete task | Click delete icon, confirm modal | Task removed from list permanently | If Supabase fails, show error toast, don't remove from UI |
| Filter - Pending | Click "Pending" tab | Show only `completed: false` tasks | Empty state: "No pending tasks — good work!" |
| Filter - Completed | Click "Completed" tab | Show only `completed: true` tasks | Empty state: "No completed tasks yet" |
| Offline mode | `NEXT_PUBLIC_USE_MOCK_DATA=true` | Yellow banner "Offline mode", mock data displayed, actions disabled | User sees data but cannot edit |
| No tasks exist | Empty database or mock | "No tasks yet — create the first one" with visual | N/A |

</frozen-after-approval>

## Code Map

- `todo-list/lib/types/todo.ts` -- TypeScript interface for Todo type
- `todo-list/lib/supabase/server.ts` -- Supabase client initialization (connection pooling)
- `todo-list/lib/data/mock.ts` -- Mock data array + fallback logic
- `todo-list/lib/data/todos.ts` -- Data access layer (getTodos, getTodoById with mock fallback)
- `todo-list/app/actions/todos.ts` -- Server Actions (createTodo, updateTodo, deleteTodo, toggleComplete)
- `todo-list/app/components/TodoList.tsx` -- Main client component (filter state, renders list)
- `todo-list/app/components/TodoItem.tsx` -- Individual task card (checkbox, edit, delete)
- `todo-list/app/components/TodoForm.tsx` -- Add/edit form modal with validation
- `todo-list/app/components/FilterTabs.tsx` -- Three-button filter UI
- `todo-list/app/components/OfflineBanner.tsx` -- Yellow banner when in mock mode
- `todo-list/app/page.tsx` -- Root page Server Component (fetches initial data, renders TodoList)
- `todo-list/app/layout.tsx` -- Update header with "TODO List" title + counter
- `todo-list/app/globals.css` -- Tailwind base styles (already exists, may need minor tweaks)
- `todo-list/.env.local` -- Environment variables (create with Supabase config + mock flag)
- `todo-list/package.json` -- Add @supabase/supabase-js dependency

## Tasks & Acceptance

**Execution:**
- [x] `todo-list/package.json` -- Add `@supabase/supabase-js` dependency -- Required for AD-02 Supabase integration
- [x] `todo-list/.env.local` -- Create with `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_USE_MOCK_DATA=true` (default to mock for dev) -- Environment config per Winston's AD-02
- [x] `todo-list/lib/types/todo.ts` -- Define Todo interface matching briefing structure (id, title, description, completed, createdAt) -- Type safety foundation
- [x] `todo-list/lib/supabase/server.ts` -- Initialize Supabase client with env vars, export singleton -- AD-02 implementation
- [x] `todo-list/lib/data/mock.ts` -- Export mock todos array (~5 sample tasks) -- AD-03 fallback data
- [x] `todo-list/lib/data/todos.ts` -- Implement getTodos(), getTodoById() with `USE_MOCK` flag check -- Data access abstraction per AD-03
- [x] `todo-list/app/actions/todos.ts` -- Implement createTodo, updateTodo, deleteTodo, toggleComplete Server Actions with BR-10 validation -- Mutation layer per Winston's server-side pattern
- [x] `todo-list/app/components/FilterTabs.tsx` -- Three buttons (All/Pending/Completed) with active state styling -- Sally's filter UI, client component for state
- [x] `todo-list/app/components/TodoItem.tsx` -- Card with checkbox, title/description, edit/delete icons, inline edit mode -- Sally's task card spec, handles BR-02 lifecycle
- [x] `todo-list/app/components/TodoForm.tsx` -- Modal with title (required) + description (optional) fields, validation per BR-10, FAB trigger -- Sally's add form + validation
- [x] `todo-list/app/components/TodoList.tsx` -- Client component managing filter state, rendering filtered TodoItem array, empty states per Sally's spec -- Main UI orchestrator
- [x] `todo-list/app/components/OfflineBanner.tsx` -- Yellow banner "Offline mode — data not syncing" when mock enabled -- Sally's offline state communication
- [x] `todo-list/app/page.tsx` -- Replace boilerplate: fetch todos server-side via getTodos(), render TodoList with initial data -- Entry point, Winston's RSC pattern
- [x] `todo-list/app/layout.tsx` -- Update metadata title to "TODO List", add centered max-w-800px wrapper per Sally's layout -- Page structure
- [x] `todo-list/app/globals.css` -- Verify Tailwind base styles, add focus-visible styles for accessibility -- Sally's a11y requirement

**Acceptance Criteria:**
- Given mock mode enabled (`NEXT_PUBLIC_USE_MOCK_DATA=true`), when page loads, then yellow offline banner appears and mock tasks display
- Given "Pending" filter selected, when user views list, then only tasks with `completed: false` are visible
- Given empty task list, when user views "Pending" filter, then empty state shows "No pending tasks — good work!"
- Given valid title (1-200 chars), when user submits create form, then new task appears at top of list with generated timestamp
- Given title is empty or whitespace-only, when user attempts submit, then button is disabled and inline error appears
- Given task in list, when user clicks checkbox, then strikethrough + opacity apply immediately and state persists
- Given task in list, when user clicks edit, enters new text, presses Enter, then updated text saves and edit mode exits
- Given task in list, when user clicks delete and confirms, then task removes permanently (no undo)
- Given Supabase configured (mock disabled), when mutations occur, then data persists to PostgreSQL
- Given keyboard navigation, when user tabs through UI, then focus order is logical (filter tabs → tasks → FAB) with visible outline

## Spec Change Log

## Design Notes

**Server Component Data Flow:**
```typescript
// app/page.tsx (Server Component)
const todos = await getTodos(); // Direct data fetch
return <TodoList initialTodos={todos} />;
```

**Client Component Interactivity:**
```typescript
// app/components/TodoList.tsx
'use client';
const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
// Manages filter state, delegates rendering to TodoItem
```

**Server Actions Pattern:**
```typescript
// app/actions/todos.ts
'use server';
export async function createTodo(title: string, description?: string) {
  // Validate per BR-10
  // Check USE_MOCK flag
  // Insert via Supabase or return mock error
  revalidatePath('/');
}
```

**Validation (BR-10):**
- Title: `title.trim().length >= 1 && title.trim().length <= 200`
- Description: `!description || description.length <= 1000`
- Reject whitespace-only titles

**Empty States (Sally's spec):**
- All filter, no tasks: "No tasks yet — create the first one" + illustration
- Pending filter, no pending: "No pending tasks — good work!"
- Completed filter, no completed: "No completed tasks yet"

## Verification

**Commands:**
- `cd todo-list && npm run build` -- expected: build succeeds with 0 errors
- `cd todo-list && npm run lint` -- expected: 0 linting errors
- `cd todo-list && npm run dev` -- expected: dev server starts on port 3000

**Manual checks:**
- Open `http://localhost:3000` and verify mock data loads with offline banner
- Create task with valid title → appears at top
- Create task with empty title → button disabled + error message
- Toggle checkbox → strikethrough applies
- Click "Pending" filter → only pending tasks visible
- Edit task inline → changes persist
- Delete task with confirmation → task removes
- Tab through UI → focus order logical, outline visible
- Verify WCAG AA contrast on text elements
