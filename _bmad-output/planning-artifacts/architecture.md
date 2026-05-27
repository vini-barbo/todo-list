# Architecture — TODO List Application

**Project:** todo-list  
**Architect:** Winston  
**Date:** 2026-05-27  
**Status:** Draft

---

## Executive Summary

Simple, modern TODO list application using Next.js App Router, Supabase PostgreSQL, and Vercel deployment. Boring tech choices for stability and developer productivity.

---

## Core Technical Decisions

### AD-01: Next.js App Router + Server Components

**Decision:** Use Next.js 14+ App Router with React Server Components as the primary rendering strategy.

**Rationale:**
- Native server-side data fetching reduces client bundle
- Simplified data flow (server → component → client)
- Vercel optimization built-in
- No additional API layer needed for simple CRUD

**Trade-offs:**
- ✅ Faster initial loads, better SEO
- ✅ Direct database access from server components
- ⚠️ Team must understand RSC mental model
- ⚠️ Some client interactivity requires 'use client' directive

---

### AD-02: Supabase Direct Connection (PostgreSQL)

**Decision:** Use `@supabase/supabase-js` client with connection pooling via environment variables.

**Rationale:**
- Direct PostgreSQL connection eliminates REST API overhead
- Built-in connection pooling handles Vercel serverless constraints
- Row Level Security (RLS) for future auth expansion
- Familiar SQL patterns for data modeling

**Trade-offs:**
- ✅ Low latency, no REST translation layer
- ✅ Native PostgreSQL features available
- ⚠️ Requires proper connection string management
- ⚠️ Must configure RLS policies (start permissive, tighten later)

**Connection Pattern:**
```typescript
// lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

---

### AD-03: Mock Fallback Strategy

**Decision:** Feature flag + in-memory mock data for offline development.

**Rationale:**
- Enables development without Supabase connection
- Useful for demos and testing
- Simple implementation via environment variable

**Trade-offs:**
- ✅ Zero external dependencies for dev
- ✅ Fast iteration during prototyping
- ⚠️ Must maintain mock data parity
- ⚠️ Additional conditional logic in data layer

**Pattern:**
```typescript
// lib/data/todos.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

export async function getTodos() {
  if (USE_MOCK) return mockTodos
  return await supabase.from('todos').select('*')
}
```

---

### AD-04: Tailwind CSS for Styling

**Decision:** Utility-first styling with Tailwind CSS, no component library initially.

**Rationale:**
- Fast prototyping with utility classes
- Small bundle size (only used classes included)
- No design system overhead for v1
- Easy to migrate to shadcn/ui later if needed

**Trade-offs:**
- ✅ Rapid UI iteration
- ✅ No library lock-in
- ⚠️ Verbose className strings
- ⚠️ Manual accessibility patterns

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Vercel Edge Network                │
│                  (CDN + SSR Runtime)                 │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTPS
                       │
┌──────────────────────▼──────────────────────────────┐
│              Next.js App Router                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  app/                                          │ │
│  │    page.tsx (Server Component)                 │ │
│  │    components/ (Client Components)             │ │
│  │    actions/ (Server Actions for mutations)     │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │  lib/                                          │ │
│  │    data/todos.ts (Data Access Layer)           │ │
│  │    supabase/server.ts (DB Client)              │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │ USE_MOCK?                 │
         │                           │
    YES  │                           │ NO
         │                           │
    ┌────▼─────┐           ┌─────────▼────────┐
    │  Mock    │           │    Supabase      │
    │  Data    │           │   PostgreSQL     │
    │ (Memory) │           │ (Connection Pool)│
    └──────────┘           └──────────────────┘
```

---

## Data Model

### Table: `todos`

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for common queries
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

**Rationale:**
- UUID for distributed ID generation
- `created_at` for default sort order
- Indexes on filter fields (completed) and sort field (created_at)
- Simple schema, no premature normalization

---

## Folder Structure

```
/app
  /page.tsx              # Main TODO list page (RSC)
  /components
    /TodoList.tsx        # Client component for interactivity
    /TodoItem.tsx        # Individual todo display
    /TodoForm.tsx        # Create/Edit form
  /actions
    /todos.ts            # Server Actions (create, update, delete)
/lib
  /data
    /todos.ts            # Data access functions
    /mock.ts             # Mock data + fallback logic
  /supabase
    /server.ts           # Supabase client config
  /types
    /todo.ts             # TypeScript interfaces
/public
  # Static assets
```

---

## Key Principles Applied

1. **Rule of Three:** Starting with inline code. Will extract patterns after third repetition.
2. **Boring Technology:** Next.js + PostgreSQL + Vercel — battle-tested stack, minimal surprises.
3. **Developer Productivity:** Direct database access from server components, no API layer overhead.

---

## Deployment Strategy

**Platform:** Vercel (native Next.js optimization)

**Environment Variables Required:**
```
NEXT_PUBLIC_SUPABASE_URL=https://bxlwatnatwjofbqzzcjo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_USE_MOCK_DATA=false  # true for demo mode
```

**Build Configuration:**
- Framework: Next.js
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**Database Connection:**
- Use Supabase connection pooler (port 5432) for serverless functions
- Enable connection pooling in Supabase project settings
- Vercel automatically scales Next.js instances

---

## Future Considerations (Out of Scope for V1)

- **Authentication:** Supabase Auth + Row Level Security when multi-user needed
- **Real-time Updates:** Supabase Realtime subscriptions for collaborative editing
- **Optimistic UI:** React Query or SWR for better perceived performance
- **Component Library:** shadcn/ui if design system emerges
- **Testing:** Playwright E2E tests once feature set stabilizes

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase connection limits | Medium | Connection pooling enabled; monitor dashboard |
| Vercel cold starts | Low | Edge runtime for critical paths; acceptable for v1 |
| TypeScript learning curve | Low | Team intermediate level; incremental adoption |
| Mock data drift | Low | Single source of truth in `mock.ts`; validate against DB schema |

---

## Next Steps

1. ✅ Architecture approved
2. ⬜ Set up Next.js project (`npx create-next-app@latest`)
3. ⬜ Configure Supabase client + environment variables
4. ⬜ Create database schema in Supabase dashboard
5. ⬜ Implement data access layer with mock fallback
6. ⬜ Build UI components (TodoList, TodoItem, TodoForm)
7. ⬜ Deploy to Vercel

---

**Questions or concerns?** Let's discuss trade-offs before implementation begins.
