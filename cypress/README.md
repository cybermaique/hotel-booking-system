# Testes E2E com Cypress

Este projeto contém uma suíte completa de testes end-to-end (E2E) usando Cypress para o Sistema de Reserva de Hotéis.

## 📋 Estrutura de Testes

### Testes E2E (`cypress/e2e/`)

1. **01-home.cy.ts** - Página Inicial
   - Carregamento da página
   - Exibição do formulário de busca
   - Navegação e responsividade
   - Acessibilidade básica

2. **02-authentication.cy.ts** - Autenticação
   - Login com credenciais válidas/inválidas
   - Registro de novos usuários
   - Logout
   - Proteção de rotas
   - Persistência de sessão

3. **03-hotel-search.cy.ts** - Busca de Hotéis
   - Formulário de busca com validações
   - Exibição de resultados
   - Ordenação e filtros
   - Paginação
   - Estados de loading e erro

4. **04-hotel-details.cy.ts** - Detalhes do Hotel
   - Informações do hotel
   - Galeria de imagens
   - Formulário de reserva
   - Validações de campos
   - Navegação

5. **05-booking-process.cy.ts** - Processo de Reserva
   - Fluxo completo de reserva
   - Validações de formulário
   - Cálculo de preços
   - Estados de loading
   - Página de confirmação
   - Tratamento de erros

6. **06-hotel-comparison.cy.ts** - Comparação de Hotéis
   - Seleção de hotéis
   - Página de comparação
   - Comparação de atributos
   - Persistência de seleção
   - Responsividade

7. **07-accessibility.cy.ts** - Acessibilidade
   - Navegação por teclado
   - ARIA labels e roles
   - Semântica HTML
   - Contraste de cores
   - Formulários acessíveis
   - Skip links

8. **08-performance.cy.ts** - Performance
   - Tempo de carregamento
   - Otimização de imagens
   - Caching e persistência
   - Bundle size
   - Renderização
   - Otimização mobile

9. **09-user-journey.cy.ts** - Jornadas de Usuário
   - Fluxo completo: busca → detalhes → reserva
   - Jornada com autenticação
   - Jornada de registro
   - Tratamento de erros
   - Diferentes viewports
   - Persistência de dados

## 🚀 Executando os Testes

### Pré-requisitos

```bash
npm install
```

### Comandos Disponíveis

```bash
# Abrir Cypress Test Runner (modo interativo)
npm run cypress:open

# Executar todos os testes em modo headless
npm run cypress:run

# Executar testes em navegador específico
npm run cypress:run:chrome
npm run cypress:run:firefox

# Executar testes E2E com servidor dev
npm run test:e2e

# Abrir Cypress com servidor dev rodando
npm run test:e2e:open
```

### Executar Testes Específicos

```bash
# Executar apenas um arquivo de teste
npx cypress run --spec "cypress/e2e/01-home.cy.ts"

# Executar múltiplos arquivos
npx cypress run --spec "cypress/e2e/01-home.cy.ts,cypress/e2e/02-authentication.cy.ts"

# Executar com navegador específico
npx cypress run --browser chrome --spec "cypress/e2e/03-hotel-search.cy.ts"
```

## 🧪 Comandos Customizados

O projeto inclui comandos customizados do Cypress para facilitar os testes:

### `cy.login(email, password)`
Faz login no sistema com as credenciais fornecidas.

```typescript
cy.login('user@example.com', 'password123')
```

### `cy.logout()`
Faz logout do sistema.

```typescript
cy.logout()
```

### `cy.fillSearchForm(destination, checkIn, checkOut, guests, rooms)`
Preenche o formulário de busca de hotéis.

```typescript
cy.fillSearchForm('São Paulo', '2025-12-01', '2025-12-05', 2, 1)
```

### `cy.fillBookingForm(data)`
Preenche o formulário de reserva com dados completos.

```typescript
cy.fillBookingForm({
  name: 'João Silva',
  email: 'joao@example.com',
  phone: '11987654321',
  cpf: '12345678900',
  cardNumber: '4111111111111111',
  cardName: 'JOAO SILVA',
  cardExpiry: '12/28',
  cardCvv: '123'
})
```

### `cy.checkAuthenticated()`
Verifica se o usuário está autenticado.

```typescript
cy.checkAuthenticated()
```

### `cy.checkNotAuthenticated()`
Verifica se o usuário não está autenticado.

```typescript
cy.checkNotAuthenticated()
```

## 📦 Fixtures

Os dados de teste estão armazenados em `cypress/fixtures/hotels.json`:

- **searchData**: Dados para busca de hotéis
- **validBooking**: Dados válidos para reserva
- **invalidBooking**: Dados inválidos para testar erros
- **validUser**: Credenciais válidas de usuário
- **invalidUser**: Credenciais inválidas

## 🎯 Cobertura de Testes

### Funcionalidades Testadas

- ✅ Navegação e roteamento
- ✅ Autenticação e autorização
- ✅ Busca e filtros de hotéis
- ✅ Visualização de detalhes
- ✅ Processo de reserva completo
- ✅ Comparação de hotéis
- ✅ Validações de formulários
- ✅ Estados de loading e erro
- ✅ Responsividade (mobile, tablet, desktop)
- ✅ Acessibilidade (WCAG)
- ✅ Performance e otimizações
- ✅ Persistência de dados
- ✅ Jornadas completas de usuário

### Tipos de Teste

- **Testes Funcionais**: Verificam se as funcionalidades funcionam corretamente
- **Testes de Integração**: Verificam a integração entre componentes
- **Testes de UI**: Verificam a interface do usuário
- **Testes de Acessibilidade**: Verificam conformidade com padrões de acessibilidade
- **Testes de Performance**: Verificam tempos de carregamento e otimizações
- **Testes de Jornada**: Verificam fluxos completos de usuário

## 🔧 Configuração

A configuração do Cypress está em `cypress.config.ts`:

```typescript
{
  baseUrl: 'http://localhost:3000',
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000
}
```

## 📊 Relatórios

Os testes geram:
- Screenshots em caso de falha
- Vídeos das execuções (se habilitado)
- Logs detalhados no console

## 🐛 Debugging

### Modo Interativo

Use `npm run cypress:open` para:
- Ver testes executando em tempo real
- Pausar e inspecionar elementos
- Ver snapshots de cada comando
- Debugar com DevTools

### Modo Headless

Use `npm run cypress:run` para:
- Executar em CI/CD
- Gerar relatórios
- Executar todos os testes rapidamente

## 📝 Boas Práticas

1. **Seletores**: Use atributos data-testid quando possível
2. **Waits**: Use cy.wait() com moderação, prefira assertions
3. **Fixtures**: Use dados de fixtures para testes consistentes
4. **Comandos Customizados**: Reutilize lógica comum
5. **Isolamento**: Cada teste deve ser independente
6. **Limpeza**: Use beforeEach para limpar estado

## 🔄 Integração Contínua

Os testes podem ser executados em pipelines CI/CD:

```yaml
# Exemplo GitHub Actions
- name: Run Cypress tests
  run: npm run test:e2e
```

## 📚 Recursos

- [Documentação Cypress](https://docs.cypress.io)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)

## 🤝 Contribuindo

Ao adicionar novos testes:

1. Siga a convenção de nomenclatura existente
2. Adicione comentários explicativos
3. Use comandos customizados quando apropriado
4. Teste em diferentes viewports
5. Considere acessibilidade
6. Documente casos de uso especiais

