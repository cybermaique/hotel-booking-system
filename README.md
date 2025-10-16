# Sistema de Reserva de Hotéis - Nuxt 3

> 🎯 **Projeto de Desafio Técnico** - Sistema completo de reserva de hotéis desenvolvido como resposta a um desafio de desenvolvimento frontend sênior.

---

## 🌐 Acesso ao Projeto

Acesse a versão hospedada na Vercel clicando no link abaixo:

👉 **[https://hotel-booking-system-ruby.vercel.app/](https://hotel-booking-system-ruby.vercel.app/)**

---

## 📋 Sobre o Desafio

Este projeto foi desenvolvido como parte de um teste prático de desenvolvimento frontend, com foco em demonstrar proficiência em tecnologias modernas e melhores práticas de desenvolvimento web. O desafio consistia em criar uma aplicação funcional de reserva de hotéis utilizando **Nuxt 3**, **TypeScript**, **Tailwind CSS** e **Pinia**, com ênfase em qualidade de código, testes automatizados e acessibilidade.

### Screenshots
<img width="1920" height="1068" alt="screencapture-localhost-3001-login-2025-10-13-14_15_53" src="https://github.com/user-attachments/assets/ebcd8b18-eb31-4512-8270-48987a78fc58" />
<img width="1920" height="3632" alt="screencapture-localhost-3001-2025-10-13-14_15_32" src="https://github.com/user-attachments/assets/0c1d913a-67ee-4fec-8a7c-f488bcc32b8d" />
<img width="1920" height="1247" alt="screencapture-localhost-3001-register-2025-10-13-14_16_03" src="https://github.com/user-attachments/assets/758e9146-74ea-4ac2-916e-349a3189a9f9" />
<img width="1920" height="3427" alt="screencapture-localhost-3001-hotels-2025-10-14-00_58_02" src="https://github.com/user-attachments/assets/c12821da-6170-4dde-9ecc-4dec6fb83b7e" />
<img width="1920" height="1558" alt="screencapture-localhost-3001-hotels-5-2025-10-13-14_16_35" src="https://github.com/user-attachments/assets/9999ec98-78c8-4a6e-acf3-ede4be6f8e68" />
<img width="1920" height="1957" alt="screencapture-localhost-3001-confirmation-2025-10-13-14_18_05" src="https://github.com/user-attachments/assets/ae6e319b-57a7-4142-a309-bf9eccb9157c" />
<img width="1920" height="1221" alt="screencapture-localhost-3000-compare-2025-10-14-00_08_12" src="https://github.com/user-attachments/assets/dc5d471b-7702-4ad4-95ac-3bfe8198fcc4" />

### Objetivos Cumpridos

- ✅ Implementar sistema completo de pesquisa, comparação e reserva de hotéis
- ✅ Criar arquitetura modular e escalável com Nuxt Layers
- ✅ Desenvolver APIs mock server-side com SSR
- ✅ Garantir acessibilidade (WCAG 2.1) e responsividade
- ✅ Implementar testes automatizados (unitários e E2E)
- ✅ Configurar pipeline de CI/CD com GitHub Actions
- ✅ Otimizar performance (SSR, code splitting, lazy loading)

---

## ✨ Funcionalidades Implementadas

### 🔍 Pesquisa Avançada de Hotéis
- Formulário de busca com validação de campos (destino, datas, quartos, hóspedes)
- Filtros dinâmicos por localização e preço
- Ordenação por preço, avaliações e nome
- Resultados em tempo real com feedback visual

### 🔄 Comparação de Hotéis
- Seleção de até 3 hotéis para comparação lado a lado
- Visualização detalhada de características, preços e comodidades
- Interface intuitiva para adicionar/remover hotéis da comparação

### 📝 Sistema de Reservas
- Formulário completo com validação de dados pessoais
- Múltiplos métodos de pagamento (cartão de crédito, débito, PIX)
- Validação de campos de pagamento
- Confirmação de reserva com número de referência

### 🔐 Autenticação de Usuários
- Sistema de login/registro com Pinia
- Proteção de rotas sensíveis com middleware global
- Sessão gerenciada via cookies HTTP-only (segurança contra XSS)
- Persistência de estado com hidratação SSR

### 🔔 Sistema de Notificações
- Feedback em tempo real para ações do usuário
- Notificações de sucesso, erro e informação
- Toast messages com auto-dismiss configurável

### ♿ Acessibilidade
- Conformidade com WCAG 2.1 (Level AA)
- Navegação completa por teclado
- ARIA labels e roles apropriados
- Skip links para conteúdo principal
- Contraste adequado e foco visível
  
### 🔢 Paginação (Backend + Frontend)
- Backend (Nitro): endpoints recebem page e limit e retornam { data, pagination: { page, limit, total, totalPages } }.
- Frontend (Nuxt 3): a UI só navega entre páginas (atualiza a URL/consulta) e não fatia dados no cliente; sempre refaz a requisição com os parâmetros atuais.
- Caso especial – comparação: /api/hotels?ids=1,2,3 retorna exatamente esses hotéis (sem paginação efetiva), para a página /compare.

---

## 🛠️ Stack Tecnológica

- **Nuxt 3** - Framework Vue.js com SSR e renderização híbrida
- **TypeScript** - Tipagem estática para robustez e manutenibilidade
- **Tailwind CSS** - Framework CSS utilitário para estilização rápida e consistente
- **Pinia** - Gerenciamento de estado centralizado e type-safe
- **Nuxt Layers** - Arquitetura modular com design system isolado
- **Nitro** - Servidor backend para APIs mock server-side
- **Vitest** - Framework de testes unitários rápido e moderno
- **Cypress** - Framework de testes end-to-end com suporte a acessibilidade
- **GitHub Actions** - Pipeline de CI/CD automatizado

---

## 📁 Estrutura do Projeto

```
.
├── .github/workflows/          # Workflows de CI/CD
│   ├── ci.yml                  # Pipeline de integração contínua
│   └── deploy.yml              # Pipeline de deploy
├── layers/design-system/       # Nuxt Layer para o Design System
│   └── components/             # Componentes (Atoms, Molecules, Organisms)
│       ├── atoms/              # Componentes básicos (Button, Input, Badge)
│       ├── molecules/          # Componentes compostos (HotelCard, SearchBar)
│       └── organisms/          # Componentes complexos (BookingForm, HotelList)
├── components/                 # Componentes globais da aplicação
│   ├── Header.vue
│   ├── Toast.vue
│   └── HotelImageGallery.vue
├── composables/                # Funções reutilizáveis (Composition API)
│   ├── useHotels.ts
│   ├── useNotifications.ts
│   ├── useReservation.ts
│   ├── useSEO.ts
│   └── useFormatters.ts
├── pages/                      # Páginas e rotas da aplicação
│   ├── index.vue               # Página inicial
│   ├── login.vue               # Página de login
│   ├── register.vue            # Página de registro
│   ├── compare.vue             # Página de comparação
│   ├── confirmation.vue        # Página de confirmação de reserva
│   └── hotels/
│       ├── index.vue           # Lista de hotéis
│       └── [id].vue            # Detalhes do hotel
├── server/api/                 # Endpoints da API mock (Nitro)
│   ├── auth/                   # Endpoints de autenticação
│   ├── hotels.get.ts           # Busca de hotéis
│   ├── hotels/[id].get.ts      # Detalhes de hotel específico
│   └── reserve.post.ts         # Criação de reserva
├── stores/                     # Stores Pinia
│   └── auth.ts                 # Store de autenticação
├── middleware/                 # Middlewares de rota
│   └── auth.global.ts          # Middleware de autenticação global
├── test/                       # Testes unitários (Vitest)
│   ├── components/             # Testes de componentes
│   ├── composables/            # Testes de composables
│   └── stores/                 # Testes de stores
├── cypress/                    # Testes E2E (Cypress)
│   ├── e2e/                    # Suítes de testes E2E
│   └── fixtures/               # Dados de teste
├── types/                      # Definições de tipos TypeScript
│   ├── hotel.ts
│   └── common.ts
├── docs/                       # Documentação do projeto
│   └── architecture.md         # Decisões de arquitetura
├── nuxt.config.ts              # Configuração principal do Nuxt
├── vitest.config.ts            # Configuração do Vitest
├── cypress.config.ts           # Configuração do Cypress
└── package.json                # Dependências e scripts
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- **Node.js** v20 ou superior
- **npm** ou **pnpm**

Caso dê algum problema, use node v22.14.0 e npm v10.9.2 que são as versões que estou utilizando.


### Passos para Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/hotel-booking-system.git
cd hotel-booking-system

# 2. Instale as dependências
npm install

# 3. (Opcional) Configure variáveis de ambiente
# cp .env.example .env

# 4. Execute em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em **`http://localhost:3000`**.

### Usuários de Teste

Para testar o sistema de autenticação, utilize as seguintes credenciais:

- **Email:** `user@demo.com`
- **Senha:** `123456`

Ou crie uma nova conta através da página de registro.

---

## 🧪 Testes

O projeto possui uma suíte completa de testes automatizados contendo 465 testes:

- **311 testes unitários** (Vitest)
- **154 testes E2E** (Cypress)

### Executar Testes

```bash
# Testes unitários (Vitest)
npm run test                    # Modo watch
npm run test:run                # Execução única
npm run test:ui                 # Interface visual
npm run test:coverage           # Relatório de cobertura

# Testes E2E (Cypress)
npm run cypress:open            # Interface interativa
npm run test:e2e                # Modo headless
npm run cypress:run:chrome      # Executar no Chrome
npm run cypress:run:firefox     # Executar no Firefox
```

### Cobertura de Testes

Os testes cobrem:

- ✅ Componentes do design system (Atoms, Molecules, Organisms)
- ✅ Componentes globais (Header, Toast, HotelImageGallery)
- ✅ Composables (useHotels, useNotifications, useReservation, useFormatters)
- ✅ Stores Pinia (auth)
- ✅ Fluxos E2E (navegação, autenticação, busca, reserva, comparação)
- ✅ Acessibilidade (navegação por teclado, ARIA, semântica)
- ✅ Performance (métricas de carregamento, otimizações)

---

## 🔄 CI/CD

O projeto utiliza **GitHub Actions** para integração e deploy contínuo.

### Pipeline de CI (`ci.yml`)

Executado automaticamente em:
- Push para as branches `master` e `develop`
- Pull requests para `master` e `develop`

**Jobs incluídos:**

1. **Lint e Type Check** - Validação de tipos TypeScript
2. **Testes Unitários** - Execução de testes com Vitest e geração de relatório de cobertura
3. **Testes E2E** - Execução de testes Cypress com upload de screenshots e vídeos
4. **Build** - Compilação do projeto em modo produção
5. **Análise de Segurança** - Auditoria de vulnerabilidades com `npm audit`
6. **Deploy Preview** - Comentário automático em PRs com status do build

### Pipeline de Deploy (`deploy.yml`)

Executado automaticamente em:
- Push para a branch `main`
- Criação de tags `v*`

**Artefatos gerados:**
- Relatório de cobertura de testes (retenção: 30 dias)
- Screenshots de testes E2E em caso de falha (retenção: 7 dias)
- Vídeos de testes E2E (retenção: 7 dias)
- Build de produção (retenção: 7 dias)

---

## 📐 Decisões de Arquitetura

As principais decisões técnicas e trade-offs estão documentados em [`docs/architecture.md`](./docs/architecture.md).

### Destaques

#### 1. Nuxt Layers para Design System

**Decisão:** Isolar componentes de UI em um Nuxt Layer dedicado (`layers/design-system`).

**Justificativa:**
- Reutilização em múltiplos projetos
- Separação clara entre apresentação e lógica de negócio
- Facilita manutenção e testes isolados

#### 2. Autenticação via Cookie HTTP-only

**Decisão:** Utilizar cookies HTTP-only para gerenciamento de sessão.

**Justificativa:**
- Segurança contra ataques XSS (cookies não acessíveis via JavaScript)
- Funciona nativamente com SSR (enviado automaticamente em requisições)
- Simplicidade (sem necessidade de refresh tokens)

**Trade-off:** Requer proteção CSRF (a ser implementada em produção).

#### 3. Fail-Safe no Logout

**Decisão:** Logout sempre limpa o estado local, mesmo se a API falhar.

**Justificativa:**
- Prioriza experiência do usuário sobre consistência temporária
- Evita que usuário fique "preso" em estado inconsistente
- Estado é revalidado na próxima tentativa de acesso a rota protegida

#### 4. Web Component para Portabilidade

**Decisão:** Criar Web Component (`HotelCardWebComponent.vue`) para o card de hotel.

**Justificativa:**
- Demonstra capacidade de criar componentes agnósticos de framework
- Pode ser usado em projetos React, Angular ou HTML puro
- Encapsulamento completo de estilos e lógica

---

## ♿ Acessibilidade

O projeto foi desenvolvido com foco em acessibilidade, seguindo as diretrizes do **WCAG 2.1 (Level AA)**:

### Implementações

- **Semântica HTML5:** Uso correto de tags (`<main>`, `<nav>`, `<header>`, `<section>`, `<article>`)
- **ARIA:** Atributos ARIA para componentes dinâmicos (`role`, `aria-label`, `aria-live`)
- **Navegação por Teclado:** Foco visível e ordem lógica de tabulação
- **Skip Link:** Link para pular diretamente para o conteúdo principal
- **Contraste:** Cores com contraste adequado (mínimo 4.5:1 para texto normal)
- **Formulários:** Labels associados, mensagens de erro descritivas
- **Imagens:** Atributos `alt` descritivos para todas as imagens

### Testes de Acessibilidade

- Suite dedicada de testes E2E (`06-accessibility.cy.ts`)
- Verificação de navegação por teclado
- Validação de ordem de foco
- Testes de ativação de elementos com Enter/Space
- Verificação de indicadores visuais de foco

---

## 🚀 Performance

O projeto implementa diversas otimizações de performance:

### Otimizações Implementadas

- **SSR (Server-Side Rendering):** Renderização no servidor para TTFB rápido
- **Code Splitting:** Divisão automática de código por rota
- **Lazy Loading:** Carregamento sob demanda de componentes e imagens
- **SWR Cache:** Cache de rotas com `routeRules` para dados dinâmicos
- **Prefetch:** Pré-carregamento inteligente de links para navegação instantânea
- **Tree Shaking:** Remoção de código não utilizado no build de produção
- **Minificação:** Compressão de JavaScript e CSS

### Métricas

- Suite dedicada de testes de performance (`07-performance.cy.ts`)
- Medição de métricas de carregamento
- Validação de otimizações (lazy loading, code splitting)

---

## 📝 Notas sobre o Desenvolvimento

### Processo de Desenvolvimento

Este projeto foi desenvolvido com foco em **entregar funcionalidades completas e testadas** dentro do prazo do desafio técnico. Por isso, priorizei:

- ✅ Implementação completa de todos os requisitos funcionais e técnicos
- ✅ Testes automatizados abrangentes (unitários e E2E)
- ✅ Documentação de decisões de arquitetura
- ✅ Pipeline de CI/CD funcional e robusto
- ✅ Código limpo, tipado e bem organizado

### Sobre Pull Requests

Como este é um **desafio técnico individual** e não um projeto em equipe, **não criei PRs detalhadas** com descrições extensas e evidências visuais (screenshots, GIFs). O foco foi em **entregar valor rapidamente** sem a sobrecarga de documentação de PRs que não seriam revisadas por uma equipe.

#### Minha Prática em Projetos Reais

Em um ambiente de trabalho real com equipes, minha prática padrão é:

- 📝 **Criar PRs descritivas** com contexto completo e motivação das mudanças
- 🖼️ **Incluir screenshots e GIFs** demonstrando mudanças visuais e comportamentais
- ✅ **Adicionar checklists de verificação** para garantir qualidade
- 🔗 **Referenciar issues e tickets** relacionados (Jira, GitHub Issues, etc.)
- 💬 **Solicitar revisões específicas** quando necessário
- 🧪 **Documentar casos de teste** e evidências de funcionamento
- 📊 **Incluir métricas** de performance quando relevante

#### Exemplo de Projeto com PRs Detalhadas

Para demonstrar minha capacidade de criar PRs profissionais e bem documentadas, recomendo consultar um projeto anterior onde fui aprovado:

**[Desafio Inlog - Vaga Frontend Developer](https://github.com/cybermaique/Desafio-Inlog---Vaga-Frontend-Developer)**

Neste projeto, criei várias PRs com:
- Descrições detalhadas das mudanças
- Screenshots e GIFs das funcionalidades
- Evidências de testes e validações
- Contexto técnico e justificativas

Este projeto pode ser consultado como referência do meu processo de trabalho em equipe e boas práticas de colaboração via Git/GitHub.

---

## 🎯 Requisitos do Desafio

### Requisitos Funcionais

| Requisito | Status |
|-----------|--------|
| Pesquisa de hotéis com critérios (destino, datas, quartos, hóspedes) | ✅ |
| Exibição de resultados com ordenação (preço, avaliações, etc.) | ✅ |
| Comparação de múltiplos hotéis lado a lado | ✅ |
| Formulário de reserva com dados pessoais e pagamento | ✅ |
| Sistema de notificações sobre status de reserva | ✅ |

### Requisitos Técnicos

| Requisito | Status |
|-----------|--------|
| Nuxt 3 com Composition API | ✅ |
| TypeScript | ✅ |
| Pinia para autenticação | ✅ |
| Tailwind CSS | ✅ |
| Nuxt Layers | ✅ |
| APIs mock via SSR | ✅ |
| Responsividade e acessibilidade | ✅ |
| Otimização de performance | ✅ |
| CI/CD com GitHub Actions | ✅ |

### Tarefas

| Tarefa | Status |
|--------|--------|
| Setup do projeto com SSR | ✅ |
| Estrutura com componentes reutilizáveis | ✅ |
| Implementação de funcionalidades | ✅ |
| Integração com Composition API | ✅ |
| Endpoints via SSR do Nuxt | ✅ |
| Testes com Vitest | ✅ |
| Documentação de código e arquitetura | ✅ |

---

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.

---

## 🙏 Agradecimentos

Agradeço pela oportunidade de participar deste desafio técnico. Foi uma experiência enriquecedora que me permitiu demonstrar minhas habilidades em desenvolvimento frontend moderno, arquitetura de software e boas práticas de engenharia.

Estou à disposição para esclarecer qualquer dúvida sobre o projeto ou discutir decisões técnicas.

---
