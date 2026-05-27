# Briefing — Aplicação TODO List com Next.js, Supabase e Vercel

## Visão Geral

Desenvolver uma aplicação de gerenciamento de tarefas (TODO List) moderna, responsiva e escalável utilizando:

* Next.js no frontend e backend
* Vercel para hospedagem e deploy
* Supabase como backend e banco PostgreSQL
* Dados mockados como fallback quando não houver conexão com o banco

A aplicação deve permitir que usuários criem, editem, removam e organizem tarefas de maneira simples e intuitiva.

---

# Objetivo do Projeto

Criar uma aplicação fullstack moderna para gerenciamento de tarefas com:

* Interface moderna
* Arquitetura escalável
* Integração com Supabase
* Deploy simplificado na Vercel
* Fallback offline utilizando mocks
* Código limpo e organizado

---

# Stack Tecnológica

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend / Banco

* Supabase
* PostgreSQL
* Supabase SDK

## Deploy

* Vercel

---

# Funcionalidades Principais

## Gerenciamento de Tarefas

O usuário deve conseguir:

* Criar tarefas
* Editar tarefas
* Excluir tarefas
* Marcar tarefas como concluídas
* Filtrar tarefas:

  * Todas
  * Pendentes
  * Concluídas

---

# Estrutura da Tarefa

```ts id="yzc6ny"
{
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}
```

---

# Integração com Supabase

A aplicação deverá conectar diretamente ao banco PostgreSQL do Supabase utilizando variáveis de ambiente seguras.

## Connection String

```env id="h2jp5l"
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.bxlwatnatwjofbqzzcjo.supabase.co:5432/postgres
```

## Dados da Conexão

```text id="l7e8kn"
Host: db.bxlwatnatwjofbqzzcjo.supabase.co
Port: 5432
Database: postgres
User: postgres
```

---

# Variáveis de Ambiente

Exemplo do arquivo `.env.local`:

```env id="a4l1a3"
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.bxlwatnatwjofbqzzcjo.supabase.co:5432/postgres
```

---

# Instalação do Supabase SDK

```bash id="6q9n6l"
npm install @supabase/supabase-js
```

---

# Agent Skills (Opcional)

Para melhorar integração com ferramentas de IA e desenvolvimento assistido:

```bash id="4p3f4o"
npx skills add supabase/agent-skills
```

---

# Funcionamento Offline / Fallback

Caso não exista conexão com o banco do Supabase:

* O sistema deve utilizar automaticamente dados mockados
* O usuário não deve visualizar erros críticos
* Exibir aviso discreto:

  * “Modo offline ativo”
* A aplicação deve continuar funcionando normalmente

---

# Fluxo da Aplicação

## Fluxo Principal

```text id="k8q38d"
Frontend → Supabase → PostgreSQL
```

## Fluxo Offline

```text id="cxmv4r"
Frontend → Mock Data Local
```

---

# Estrutura de Pastas (Sugestão)

```text id="1y9mx7"
src/
 ├── app/
 ├── components/
 ├── services/
 ├── hooks/
 ├── mocks/
 ├── lib/
 ├── types/
 └── styles/
```

---

# Estrutura Recomendada

## `lib/supabase.ts`

Responsável pela criação do client do Supabase.

## `services/tasks.service.ts`

Responsável por:

* Buscar tarefas
* Criar tarefas
* Atualizar tarefas
* Remover tarefas
* Fazer fallback automático para mocks

---

# APIs / Serviços Necessários

## Buscar tarefas

```ts id="g7vtvz"
GET /tasks
```

## Criar tarefa

```ts id="6w76jc"
POST /tasks
```

## Atualizar tarefa

```ts id="my2f9k"
PUT /tasks/:id
```

## Remover tarefa

```ts id="6q8p1n"
DELETE /tasks/:id
```

---

# Regras de Negócio

## Criação

* O título é obrigatório
* Não permitir tarefas vazias

## Conclusão

* Tarefas concluídas devem possuir diferenciação visual

## Exclusão

* Solicitar confirmação antes da remoção

---

# Tratamento de Erros

A aplicação deve:

* Detectar falha de conexão
* Fazer fallback automático
* Evitar quebra de interface
* Registrar erros no console

---

# Requisitos Não Funcionais

## Performance

* Carregamento rápido
* Baixo tempo de resposta

## Responsividade

* Desktop
* Tablet
* Mobile

## Escalabilidade

Estrutura preparada para:

* Autenticação futura
* Multiusuários
* Compartilhamento de tarefas

---

# Diferenciais Desejáveis

* Dark mode
* Toast notifications
* Skeleton loading
* Persistência local com LocalStorage
* Drag and drop
* Animações suaves

---

# Objetivo Final

Entregar uma aplicação TODO List moderna, resiliente e pronta para produção utilizando:

* [Next.js](https://nextjs.org?utm_source=chatgpt.com)
* [Supabase](https://supabase.com?utm_source=chatgpt.com)
* [Vercel](https://vercel.com?utm_source=chatgpt.com)

com fallback inteligente para funcionamento mesmo sem conexão com o banco de dados PostgreSQL.
