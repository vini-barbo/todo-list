# Business Rules — TODO List Application

**Project:** todo-list  
**PM:** John  
**Date:** 2026-05-27

---

## Core Business Rules

1. **BR-01: Task Creation** — Usuários podem criar tarefas com título obrigatório e descrição opcional; sistema gera ID único e timestamp automaticamente.

2. **BR-02: Task Lifecycle** — Toda tarefa inicia com status `completed = false`; usuário pode alternar estado entre pendente/concluída via toggle.

3. **BR-03: Task Editing** — Título e descrição são editáveis a qualquer momento; alteração não afeta `createdAt` nem histórico de conclusão.

4. **BR-04: Task Deletion** — Exclusão é permanente e irreversível; não há lixeira ou soft-delete na v1 (KISS principle).

5. **BR-05: Task Filtering** — Sistema oferece três visualizações: "Todas", "Pendentes" (`completed = false`), "Concluídas" (`completed = true`).

6. **BR-06: Default Sorting** — Tarefas ordenadas por `createdAt DESC` (mais recentes primeiro); usuário não pode alterar ordenação na v1.

7. **BR-07: Data Persistence** — Sistema persiste no Supabase PostgreSQL em produção; fallback para mock in-memory quando `USE_MOCK_DATA = true`.

8. **BR-08: No Authentication** — V1 é single-user sem login; todas as tarefas são públicas dentro da instância (auth = fase 2).

9. **BR-09: Offline Behavior** — Quando sem conexão com Supabase, aplicação usa dados mockados em modo read-only (sem sincronização posterior).

10. **BR-10: Validation Rules** — Título: min 1 char, max 200 chars, obrigatório; Descrição: max 1000 chars, opcional; whitespace-only titles são rejeitados.

---

## Out of Scope (V1)

- Multi-user collaboration
- Task priority/tags/categories
- Due dates or reminders
- Subtasks or task hierarchy
- Undo/redo operations
- Task search functionality
- Real-time sync entre devices

---

**Próximo passo:** Essas regras validam o briefing? Se sim, posso criar os Epics e Stories para desenvolvimento.
