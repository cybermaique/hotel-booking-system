# Workflows de CI/CD

Este diretório contém os workflows de integração contínua e deploy contínuo do projeto.

## Workflows Disponíveis

### 1. CI Pipeline (`ci.yml`)

Executado automaticamente em:
- Push para branches `main` e `develop`
- Pull requests para `main` e `develop`

**Jobs incluídos:**

#### Lint e Type Check
- Verifica tipagem TypeScript
- Valida código com ESLint (se configurado)

#### Testes Unitários
- Executa todos os testes unitários com Vitest
- Gera relatório de cobertura de código
- Faz upload do relatório como artefato

#### Testes E2E
- Executa testes end-to-end com Cypress
- Captura screenshots em caso de falha
- Grava vídeos de todos os testes
- Faz upload de screenshots e vídeos como artefatos

#### Build
- Compila o projeto para produção
- Valida que o build está funcionando
- Faz upload do build como artefato

#### Análise de Segurança
- Executa `npm audit` para verificar vulnerabilidades
- Alerta sobre dependências com problemas de segurança

#### Deploy Preview
- Executado apenas em Pull Requests
- Comenta no PR com informações do preview

### 2. Deploy Produção (`deploy.yml`)

Executado automaticamente em:
- Push para branch `main`
- Criação de tags com padrão `v*` (ex: v1.0.0)

**Jobs incluídos:**

#### Deploy
- Faz build otimizado para produção
- Cria release notes automaticamente para tags
- Deploy para ambiente de produção

## Artefatos Gerados

Os workflows geram os seguintes artefatos:

- **coverage-report**: Relatório de cobertura de testes (30 dias)
- **cypress-screenshots**: Screenshots de testes E2E que falharam (7 dias)
- **cypress-videos**: Vídeos de todos os testes E2E (7 dias)
- **nuxt-build**: Build compilado do projeto (7 dias)

## Badges para README

Adicione estes badges ao README.md principal:

```markdown
![CI Status](https://github.com/seu-usuario/hotel-booking/workflows/CI%2FCD%20Pipeline/badge.svg)
![Deploy Status](https://github.com/seu-usuario/hotel-booking/workflows/Deploy%20Produção/badge.svg)
```

## Configuração Necessária

### Secrets do GitHub

Para deploy em produção, configure os seguintes secrets no repositório:

- `DEPLOY_TOKEN`: Token de autenticação do provedor de hospedagem
- Outros secrets específicos do seu provedor

### Environments

Configure o environment `production` nas configurações do repositório para:
- Adicionar proteções de deploy
- Configurar reviewers obrigatórios
- Adicionar secrets específicos de produção

## Executar Localmente

Para testar os comandos do CI localmente:

```bash
# Type check
npx nuxi typecheck

# Testes unitários
npm run test:run

# Testes com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e

# Build
npm run build
```

## Melhorias Futuras

- [ ] Adicionar cache de dependências do Cypress
- [ ] Implementar deploy automático para staging
- [ ] Adicionar notificações no Slack/Discord
- [ ] Implementar rollback automático em caso de falha
- [ ] Adicionar análise de performance (Lighthouse CI)

