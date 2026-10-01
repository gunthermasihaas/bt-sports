# BT Sports

Plataforma web para apresentação e gerenciamento de pacotes de viagens esportivas.

O projeto possui duas áreas principais:

- **Área pública:** apresentação de pacotes, categorias, conteúdo institucional e formulário de contato.
- **Área administrativa:** autenticação, gerenciamento de usuários, categorias, pacotes, imagens e conteúdo.

A aplicação é construída com Next.js e utiliza PostgreSQL como banco de dados, Prisma como ORM, NextAuth para autenticação, Vercel Blob para armazenamento de imagens e Upstash Redis para rate limiting.

---

## Sumário

- [Visão geral](#visão-geral)
- [Principais funcionalidades](#principais-funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Requisitos](#requisitos)
- [Configuração local](#configuração-local)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Banco de dados](#banco-de-dados)
- [Autenticação e autorização](#autenticação-e-autorização)
- [Upload de imagens](#upload-de-imagens)
- [Rate limiting](#rate-limiting)
- [Scripts disponíveis](#scripts-disponíveis)
- [Desenvolvimento](#desenvolvimento)
- [Build de produção](#build-de-produção)
- [Documentação](#documentação)
- [Segurança](#segurança)
- [Estado atual do projeto](#estado-atual-do-projeto)
- [Licença](#licença)

---

## Visão geral

O BT Sports foi desenvolvido para centralizar a apresentação e administração de pacotes de viagens esportivas.

Um pacote pode possuir:

- nome;
- slug;
- data de início;
- preço;
- moeda;
- texto de destaque;
- resumo;
- descrição rica;
- categoria;
- imagens;
- depoimentos;
- status de destaque;
- controle de exclusão lógica.

A aplicação possui separação entre conteúdo público e funcionalidades administrativas.

---

## Principais funcionalidades

### Área pública

A aplicação disponibiliza páginas para:

- página inicial;
- listagem de pacotes;
- detalhe de pacote;
- listagem de categorias;
- detalhe de categoria;
- página institucional;
- página de contato.

Os pacotes são apresentados através de dados persistidos no banco de dados.

### Área administrativa

A área administrativa possui:

- login;
- controle de acesso por função;
- dashboard;
- gerenciamento de usuários;
- gerenciamento de categorias;
- criação de pacotes;
- edição de pacotes;
- gerenciamento de imagens;
- gerenciamento de conteúdo dos pacotes;
- controle de pacote em destaque;
- limpeza de arquivos órfãos no armazenamento.

---

## Stack

### Aplicação

- Next.js 16
- React 19
- TypeScript 5
- App Router
- Tailwind CSS 4

### Banco de dados

- PostgreSQL
- Prisma 7
- `@prisma/adapter-pg`

### Autenticação

- NextAuth
- Credentials Provider
- Prisma Adapter
- sessões JWT
- bcrypt

### Validação

- Zod
- React Hook Form
- `@hookform/resolvers`

### Conteúdo

- TipTap
- suporte a imagens, links, alinhamento, cor, underline e outros recursos de edição rica.

### Armazenamento

- Vercel Blob

### Segurança e infraestrutura

- Upstash Redis
- Upstash Ratelimit
- headers de segurança do Next.js

### Comunicação

- Nodemailer
- SMTP

### Interface

- Heroicons
- Font Awesome
- Headless UI
- Swiper
- Sonner

---

## Arquitetura

O projeto utiliza o App Router do Next.js.

A estrutura geral é dividida em:

```text
app/
├── (public)/
├── (admin)/
└── api/

lib/
prisma/
components/
public/
```

Os route groups `(public)` e `(admin)` permitem organizar áreas da aplicação sem incorporar o nome do grupo à URL.

A comunicação com o banco é centralizada em:

```text
lib/prisma.ts
```

A autenticação é centralizada em:

```text
lib/auth.ts
```

A autorização por função é centralizada em:

```text
lib/require-role.ts
```

O controle de rate limiting é centralizado em:

```text
lib/rate-limit.ts
```

---

## Estrutura do projeto

```text
app/
├── (admin)/
│   └── admin/
│       ├── login/
│       └── (protected)/
│           ├── categorias/
│           ├── pacotes/
│           ├── users/
│           └── page.tsx
│
├── (public)/
│   ├── categorias/
│   ├── contato/
│   ├── pacotes/
│   ├── sobre/
│   └── page.tsx
│
└── api/
    ├── admin/
    │   ├── blob-cleanup/
    │   ├── categorias-viagem/
    │   ├── pacotes/
    │   └── users/
    │
    ├── auth/
    │   └── [...nextauth]/
    │
    └── contact/

components/
lib/
prisma/
public/
```

---

## Requisitos

Para executar o projeto localmente é necessário possuir:

- Node.js compatível com a versão utilizada pelo projeto;
- npm;
- PostgreSQL;
- Redis compatível com Upstash para rate limiting;
- credenciais do Vercel Blob para upload de imagens;
- credenciais SMTP para envio do formulário de contato.

---

## Configuração local

Clone o projeto:

```bash
git clone https://github.com/gunthermasihaas/bt-sports.git
cd bt-sports
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente.

Depois execute as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client caso necessário:

```bash
npx prisma generate
```

Inicie o servidor:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

---

## Variáveis de ambiente

As principais variáveis utilizadas pela aplicação são:

```env
DATABASE_URL=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

BLOB_READ_WRITE_TOKEN=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=
```

Nunca committe valores reais dessas variáveis.

Para uma descrição detalhada, consulte:

```text
docs/DEPLOYMENT.md
```

---

## Banco de dados

O banco é PostgreSQL e o schema é definido em:

```text
prisma/schema.prisma
```

Os principais modelos são:

- `Contato`
- `CategoriaViagem`
- `Pacote`
- `Foto`
- `Depoimento`
- `User`
- `Account`
- `Session`
- `VerificationToken`

Os enums principais são:

- `TipoFoto`
- `Moeda`
- `UserRole`

As migrations ficam em:

```text
prisma/migrations/
```

Mais informações:

```text
docs/DATABASE.md
```

---

## Autenticação e autorização

O login administrativo utiliza NextAuth com Credentials Provider.

As credenciais são verificadas através de:

- normalização do e-mail;
- busca do usuário no PostgreSQL;
- comparação da senha utilizando bcrypt;
- rate limiting;
- geração de sessão JWT.

Os papéis disponíveis são:

```text
ADMIN
EDITOR
```

As rotas administrativas utilizam verificações de autorização antes de executar operações protegidas.

Consulte:

```text
docs/SECURITY.md
```

---

## Upload de imagens

Os uploads administrativos utilizam Vercel Blob.

São aceitos:

```text
JPEG
PNG
WebP
AVIF
```

O limite máximo atual é:

```text
10 MB
```

O servidor valida:

1. existência do arquivo;
2. tamanho;
3. MIME type;
4. extensão;
5. correspondência entre extensão e MIME type;
6. assinatura binária do arquivo;
7. existência do pacote;
8. estado do pacote.

Imagens de determinados tipos podem substituir a imagem existente.

Os tipos de imagem são definidos pelo enum:

```text
CAPA
GALERIA
CARD
BANNER
```

---

## Rate limiting

O projeto utiliza Upstash Ratelimit.

O formulário de contato possui limite de:

```text
5 requisições / 15 minutos / IP
```

O login possui dois mecanismos:

```text
10 tentativas / 15 minutos / combinação IP + e-mail
30 tentativas / 15 minutos / IP
```

O objetivo é reduzir abuso do formulário e ataques de tentativa repetida de autenticação.

---

## Scripts disponíveis

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Produção

```bash
npm run start
```

### Lint

```bash
npm run lint
```

### Prisma

```bash
npx prisma generate
npx prisma migrate dev
npx prisma migrate deploy
```

---

## Desenvolvimento

Durante o desenvolvimento:

```bash
npm run dev
```

Para verificar problemas de lint:

```bash
npm run lint
```

Antes de considerar uma alteração concluída, recomenda-se executar:

```bash
npm run lint
npm run build
```

As migrations devem ser criadas através do Prisma e versionadas junto com o código.

---

## Build de produção

A aplicação pode ser compilada com:

```bash
npm run build
```

Após um build bem-sucedido:

```bash
npm run start
```

Em produção, as migrations devem ser aplicadas com:

```bash
npx prisma migrate deploy
```

---

## Documentação

A documentação técnica está organizada em:

```text
docs/
├── ARCHITECTURE.md
├── API.md
├── DATABASE.md
├── DEVELOPMENT.md
├── DEPLOYMENT.md
├── SECURITY.md
└── OPERATIONS.md
```

### Arquitetura

```text
docs/ARCHITECTURE.md
```

Explica a organização interna da aplicação e os principais fluxos.

### API

```text
docs/API.md
```

Documenta os endpoints HTTP.

### Banco

```text
docs/DATABASE.md
```

Documenta os modelos, relacionamentos e regras de integridade.

### Desenvolvimento

```text
docs/DEVELOPMENT.md
```

Explica o ambiente local e o fluxo de desenvolvimento.

### Deploy

```text
docs/DEPLOYMENT.md
```

Documenta configuração de produção e variáveis de ambiente.

### Segurança

```text
docs/SECURITY.md
```

Documenta autenticação, autorização, rate limiting, uploads e headers.

### Operações

```text
docs/OPERATIONS.md
```

Documenta manutenção, migrations, limpeza de Blob e troubleshooting.

---

## Estado atual do projeto

O projeto possui infraestrutura para:

- aplicação pública;
- CMS administrativo;
- autenticação;
- RBAC;
- PostgreSQL;
- uploads de imagens;
- armazenamento externo;
- rate limiting;
- validação de dados;
- proteção de endpoints;
- migrations versionadas;
- limpeza de arquivos órfãos.

Atualmente não há script de testes automatizados definido no `package.json`.

Portanto, alterações devem ser validadas pelo menos com:

```bash
npm run lint
npm run build
```

e testes funcionais manuais das áreas afetadas.

---

## Licença

Defina aqui a licença oficial do projeto antes de publicar uma licença específica.

Se o projeto for proprietário, uma alternativa é utilizar:

```text
Copyright © BT Sports. Todos os direitos reservados.
```

Não declare MIT, Apache-2.0 ou outra licença sem que essa decisão tenha sido tomada explicitamente pelo proprietário do projeto.
