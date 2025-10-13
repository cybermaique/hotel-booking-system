# Decisões de Arquitetura

Este documento descreve as principais decisões de arquitetura e trade-offs feitos durante o desenvolvimento do projeto.

## 1. Nuxt Layers para Design System

**Decisão:** Isolar todos os componentes de UI (atoms, molecules, organisms) em um Nuxt Layer dedicado (`layers/design-system`).

**Justificativa:**
- **Reutilização:** O design system pode ser facilmente extraído e reutilizado em outros projetos Nuxt.
- **Separação de Responsabilidades:** A aplicação principal foca na lógica de negócio e orquestração, enquanto o layer foca na apresentação.
- **Manutenibilidade:** Atualizações no design system são isoladas e não afetam diretamente a lógica da aplicação.

**Trade-offs:**
- **Complexidade Inicial:** Adiciona uma camada extra de configuração e pode ser um exagero para projetos muito pequenos.
- **Gerenciamento de Dependências:** O layer pode ter suas próprias dependências, que precisam ser gerenciadas.

## 2. Autenticação via Cookie HTTP-only

**Decisão:** Utilizar cookies HTTP-only para gerenciamento de sessão, em vez de tokens JWT no localStorage.

**Justificativa:**
- **Segurança:** Cookies HTTP-only não são acessíveis via JavaScript, mitigando ataques XSS (Cross-Site Scripting).
- **SSR (Server-Side Rendering):** Funciona nativamente com SSR, pois o cookie é enviado automaticamente em cada requisição ao servidor.
- **Simplicidade:** Não requer lógica complexa de refresh tokens ou armazenamento seguro no cliente.

**Trade-offs:**
- **Acoplamento ao Domínio:** Cookies são vinculados a um domínio específico, o que pode complicar cenários com múltiplos subdomínios ou APIs em domínios diferentes (requer configuração de CORS).
- **Proteção CSRF:** Requer implementação de proteção contra CSRF (Cross-Site Request Forgery), geralmente via tokens anti-CSRF.

## 3. Tratamento de Erros em Composables

**Decisão:** Adotar estratégias diferentes de tratamento de erro nos composables:
- `useHotels`: `getHotelById` e `getHotelsByIds` retornam `null` ou `[]` em caso de erro (fail-safe), enquanto `searchHotels` propaga o erro.
- `useAuthStore`: `logout` sempre limpa o estado local, mesmo se a API falhar.

**Justificativa:**
- **Experiência do Usuário (UX):** Em muitos casos, é melhor exibir um estado vazio ou nulo do que uma página de erro completa. Propagar o erro em `searchHotels` permite que o componente de busca exiba uma mensagem de erro específica.
- **Resiliência:** O logout local garante que a UI reflita o estado de deslogado, mesmo que a comunicação com o servidor falhe, evitando que o usuário fique "preso" em um estado inconsistente.

**Trade-offs:**
- **Inconsistência Temporária:** No caso do logout, pode haver uma breve inconsistência entre o estado do cliente e do servidor, mas isso é resolvido na próxima tentativa de acesso a uma rota protegida.

## 4. Web Component para Portabilidade

**Decisão:** Criar um Web Component (`HotelCardWebComponent.vue`) para o card de hotel.

**Justificativa:**
- **Portabilidade:** O componente pode ser usado em qualquer projeto web (React, Angular, HTML puro) sem a necessidade de Vue.js.
- **Interoperabilidade:** Demonstra a capacidade de criar componentes encapsulados e agnósticos de framework.

**Trade-offs:**
- **Complexidade:** Requer configuração adicional para compilar o componente como um Web Component.
- **Comunicação:** A comunicação com o componente (props e eventos) é feita através de atributos de string e CustomEvents, o que é menos ergonômico do que o sistema de props/emits do Vue.

## 5. Testes E2E com Cypress

**Decisão:** Utilizar Cypress para testes end-to-end, incluindo testes de acessibilidade.

**Justificativa:**
- **Confiança:** Testes E2E simulam o fluxo real do usuário, garantindo que a aplicação funciona como um todo.
- **Acessibilidade:** A biblioteca `cypress-axe` permite automatizar a verificação de conformidade com as regras do WCAG.
- **Debug Visual:** Cypress oferece uma UI rica para depuração, com screenshots e vídeos dos testes.

**Trade-offs:**
- **Lentidão:** Testes E2E são significativamente mais lentos para executar do que testes unitários.
- **Manutenção:** São mais frágeis e podem quebrar com pequenas alterações na UI.

