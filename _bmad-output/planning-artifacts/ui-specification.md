# UI Specification — TODO List Application

**Project:** todo-list  
**UX Designer:** Sally  
**Date:** 2026-05-27

---

## Layout Structure

**Single-page application** com layout centrado (max-width 800px) e hierarquia visual clara: Header fixo → Filter tabs → Task list → Add button flutuante.

**Header:** Logo/título "TODO List" + contador de tarefas pendentes (ex: "5 pendentes"). Background subtle com sombra para separação.

**Filter Tabs:** Três botões horizontais (`Todas` | `Pendentes` | `Concluídas`) com active state destacado via underline + cor de acento. Seleção persiste enquanto usuário navega.

**Task List:** Cards verticais com espaçamento respirável (16px entre itens). Cada card contém: checkbox à esquerda, título/descrição ao centro, botões de ação à direita (edit/delete).

**Empty States:** Quando filtro não retorna tarefas, exibe ilustração + mensagem contextual ("Nenhuma tarefa pendente — bom trabalho!" vs "Nenhuma tarefa ainda — crie a primeira").

**Add Task Button:** Floating action button (FAB) no canto inferior direito, sempre visível. Abre modal/form inline para criação de nova tarefa.

---

## Component Interactions

**Task Card (Read Mode):** Checkbox toggle altera estado `completed` com feedback visual imediato (strikethrough + opacidade reduzida + micro-animação). Clicar no título/descrição entra em edit mode.

**Task Card (Edit Mode):** Input fields inline substituem texto estático. Botões "Salvar" (primário) e "Cancelar" (secundário) aparecem. ESC cancela, ENTER salva (se título válido).

**Delete Action:** Ícone de lixeira no hover do card. Clique abre confirmação modal simples ("Deletar '[título]'?") com botões "Cancelar" e "Deletar" (destrutivo/vermelho). Sem undo — John definiu irreversível.

**Add Task Form:** Modal/drawer com campos "Título*" (autofocus) e "Descrição" (expandível). Validação em tempo real: título vazio desabilita botão "Criar". Fechar sem salvar descarta dados (aviso se campos preenchidos).

**Validation Feedback:** Erro inline abaixo do campo (ex: "Título deve ter entre 1 e 200 caracteres"). Cor vermelha + ícone de alerta. Não usar toast — feedback no contexto.

---

## Visual Design

**Color Palette:** Neutros para estrutura (gray-100 a gray-900), cor de acento para ações primárias (ex: blue-600), vermelho para ações destrutivas, verde para completed state.

**Typography:** Sans-serif moderno (system font stack). Título da tarefa 16px medium, descrição 14px regular, labels 12px. Hierarchy via weight, não só tamanho.

**Iconography:** Outlined icons consistentes (ex: Heroicons). Checkbox, edit (pencil), delete (trash), add (plus). Tamanho 20px com padding para touch targets 44x44px.

**Spacing:** Sistema 4px base. Padding interno do card 16px, gap entre elementos 12px, margin entre cards 16px. Mobile: reduzir padding para 12px.

---

## States & Feedback

**Loading:** Skeleton screens para task list inicial. Spinner inline para ações individuais (save/delete). Nunca bloquear a UI inteira.

**Offline Mode (Mock Data):** Banner sutil no topo ("Modo offline — dados não sincronizam"). Yellow/warning color. Usuário pode visualizar mas não editar (BR-09 compliance).

**Success Feedback:** Micro-animações sutis (fade-in para nova tarefa, slide-out para delete). Sem toasts desnecessários — ação visível = feedback suficiente.

**Error Handling:** Se operação falha (ex: Supabase timeout), toast vermelho com mensagem clara ("Não foi possível salvar — tente novamente"). Não usar jargão técnico.

---

## Responsive Behavior

**Desktop (>768px):** Layout centrado com max-width 800px. Sidebar futura (tags/filters) pode ser adicionada à esquerda sem quebrar estrutura.

**Mobile (<768px):** Full-width cards, FAB levemente menor (56px → 48px), filter tabs scrolláveis horizontalmente se necessário. Delete/edit aparecem via swipe gesture OU long-press para abrir menu contextual.

**Tablet (768-1024px):** Mesma estrutura do desktop, aproveita espaço extra com padding generoso. Não precisa de layout diferenciado — responsividade fluida suficiente.

---

## Accessibility

**Keyboard Navigation:** Tab order lógico (filter tabs → tasks → FAB). ENTER ativa ações, ESC fecha modals. Focus visible com outline claro (não remover outline padrão).

**Screen Readers:** Labels semânticos (`aria-label` nos botões de ícone), `role="list"` no task container, estado do checkbox anunciado ("Tarefa 'Comprar leite' marcada como concluída").

**Color Contrast:** WCAG AA mínimo (4.5:1 para texto). Não depender apenas de cor para comunicar estado — completed usa strikethrough + opacity + ícone de check.

---

**Next Steps:** Essa spec está alinhada com as decisões técnicas do Winston e as business rules do John. Pronta para dev começar implementação. Dúvidas?
