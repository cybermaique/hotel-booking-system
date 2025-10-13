# 🧩 Workflows de CI/CD

Este diretório contém os **workflows de integração contínua (CI)** e **deploy contínuo (CD)** do projeto **Hotel Booking System**.

---

## ⚙️ Workflows Disponíveis

### 1. **CI/CD Pipeline** (`ci.yml`)

Executado automaticamente em:
- Push para as branches `master` e `develop`
- Pull requests abertos para `master` e `develop`

#### 🔍 **Jobs incluídos**

##### 🧹 Lint e Type Check
- Executa `npx nuxi typecheck` para validação de tipos TypeScript.
- Valida código com ESLint (se configurado).
- Continua mesmo em caso de erro de tipagem para não bloquear o fluxo.

##### 🧪 Testes Unitários
- Executa testes unitários com **Vitest**.
- Gera relatório de **cobertura de código**.
- Faz upload automático do artefato `coverage-report` com retenção de **30 dias**.

##### 🌐 Testes E2E (Cypress)
- Executa testes end-to-end simulando o comportamento real do usuário.
- Em caso de falha:
  - Faz upload de **screenshots** (`cypress-screenshots`).
  - Faz upload de **vídeos** (`cypress-videos`) de todos os testes (retidos por 7 dias).
- Garante observabilidade total durante o pipeline.

##### 🏗️ Build
- Compila o projeto Nuxt 3 em modo produção (`nuxt build`).
- Gera saída otimizada no diretório `.output` (preset **node-server**).
- Faz upload do build como artefato `nuxt-build` (retenção de **7 dias**).
- Usa `if-no-files-found: error` para evitar upload de pastas vazias.

##### 🔒 Análise de Segurança
- Executa `npm audit --audit-level=moderate`.
- Identifica vulnerabilidades conhecidas nas dependências do projeto.
- Não falha o pipeline — apenas emite alerta.

##### 🚀 Deploy Preview
- Executado **apenas em Pull Requests**.
- Baixa o artefato do build (`nuxt-build`).
- Exibe listagem de `.output` e versão do Node para debug.
- (Por enquanto) cria comentário automático no PR informando que o build foi concluído com sucesso:
