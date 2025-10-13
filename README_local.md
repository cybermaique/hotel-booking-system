<!--

# Sistema de Reserva de Hotéis - Nuxt 3

-->

<p align="center">
  <a href="#" target="_blank">
    <img src="https://raw.githubusercontent.com/Modyfi/vite-plugin-yaml/develop/logo.svg" width="180">
  </a>
</p>

<p align="center">
  <img alt="CI/CD" src="https://github.com/seu-usuario/seu-repositorio/actions/workflows/ci.yml/badge.svg">
  <img alt="Deploy" src="https://github.com/seu-usuario/seu-repositorio/actions/workflows/deploy.yml/badge.svg">
  <img alt="Coverage" src="https://img.shields.io/badge/coverage-95%25-brightgreen">
  <img alt="Tests" src="https://img.shields.io/badge/tests-23-blue">
</p>

<h1 align="center">Sistema de Reserva de Hotéis - Nuxt 3</h1>

<p align="center">
  Sistema completo de reserva de hotéis desenvolvido com Nuxt 3, TypeScript, Tailwind CSS e Pinia, cumprindo todos os requisitos de um desafio de desenvolvimento frontend sênior.
</p>

## 🚀 Funcionalidades

- **Pesquisa Avançada**: Formulário de busca com validação, filtros e ordenação.
- **Comparação de Hotéis**: Compare até 3 hotéis lado a lado.
- **Reservas**: Formulário completo com validação e processamento de pagamentos mock.
- **Autenticação**: Sistema de login/logout com Pinia e proteção de rotas.
- **Notificações**: Sistema de feedback em tempo real para o usuário.
- **Acessibilidade (WCAG 2.1)**: Componentes acessíveis, navegação por teclado e ARIA labels.
- **SEO Otimizado**: Meta tags, Open Graph, e URLs canônicas para melhor indexação.
- **Responsividade**: Design mobile-first adaptável a todos os tamanhos de tela.

## 🛠️ Stack Tecnológica

- **Nuxt 3**: Framework Vue.js com SSR e renderização híbrida.
- **TypeScript**: Tipagem estática para robustez e manutenibilidade.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida.
- **Pinia**: Gerenciamento de estado centralizado.
- **Nuxt Layers**: Arquitetura modular com um `design-system` separado.
- **Nitro**: Servidor backend para APIs mock server-side.
- **Vitest**: Testes unitários e de componentes.
- **Cypress**: Testes end-to-end (E2E).
- **GitHub Actions**: Pipeline de CI/CD completo.

## 📁 Estrutura do Projeto

```
.
├── .github/workflows/          # Workflows de CI/CD
│   ├── ci.yml
│   └── deploy.yml
├── layers/design-system/       # Nuxt Layer para o Design System
│   └── components/             # Componentes (Atoms, Molecules, Organisms)
├── components/                 # Componentes globais (Header, Toast)
├── composables/                # Funções reutilizáveis (useSEO, useHotels)
├── pages/                      # Páginas e rotas da aplicação
├── server/api/                 # Endpoints da API mock (Nitro)
├── stores/                     # Stores Pinia (auth.ts)
├── test/                       # Testes unitários (Vitest)
├── cypress/                    # Testes E2E (Cypress)
├── nuxt.config.ts              # Configuração principal do Nuxt
└── package.json                # Dependências e scripts
```

## 🔧 Instalação e Execução

**Pré-requisitos:**
- Node.js v20+
- npm

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env (opcional)
# cp .env.example .env

# 4. Execute em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## 🧪 Testes

O projeto possui uma suíte de testes completa com **23 testes** no total:

- **311 testes unitários** (Vitest)
- **154 testes E2E** (Cypress)

Para executá-los:

```bash
# Executar testes unitários (Vitest)
npm run test

# Executar testes unitários com UI
npm run test:ui

# Gerar relatório de cobertura de testes
npm run test:coverage

# Abrir o Cypress para testes E2E interativos
npm run cypress:open

# Executar testes E2E em modo headless
npm run test:e2e
```

## 🔄 CI/CD

O projeto utiliza **GitHub Actions** para integração e deploy contínuo.

- **`ci.yml`**: Executa lint, testes unitários, testes E2E e build a cada push ou pull request.
- **`deploy.yml`**: Realiza o deploy para produção a cada push na branch `main` ou criação de uma nova tag `v*`.

Para mais detalhes, consulte a documentação em `.github/workflows/README.md`.

## ♿ Acessibilidade

O projeto foi desenvolvido com foco em acessibilidade, seguindo as diretrizes do WCAG 2.1:

- **Semântica**: Uso correto de tags HTML5 (`<main>`, `<nav>`, `<header>`).
- **ARIA**: Atributos ARIA para componentes dinâmicos e de navegação.
- **Navegação por Teclado**: Foco visível e navegação lógica por todo o site.
- **Skip Link**: Link para pular diretamente para o conteúdo principal.
- **Contraste**: Cores com contraste adequado para garantir a legibilidade.

## 🚀 Performance

- **SSR**: Renderização no lado do servidor para um Time to First Byte (TTFB) mais rápido.
- **Code Splitting**: Divisão automática de código por rota.
- **Lazy Loading**: Carregamento sob demanda de componentes e imagens.
- **Caching**: Cache de rotas com `SWR` para dados que mudam com frequência.
- **Prefetch**: Pré-carregamento inteligente de links para navegação instantânea.

## 🎯 Próximos Passos

- [ ] Implementar Storybook para documentação visual de componentes.
- [ ] Integrar com APIs reais de hotéis e pagamentos.
- [ ] Adicionar mais filtros de busca (comodidades, categoria, etc.).
- [ ] Implementar sistema de avaliações de usuários.
- [ ] Adicionar testes de performance com Lighthouse CI no pipeline.

