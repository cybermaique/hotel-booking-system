/// <reference types="cypress" />

// Custom commands for the Hotel Booking System

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login com credenciais
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Logout do sistema
       * @example cy.logout()
       */
      logout(): Chainable<void>;

      /**
       * Preencher formulário de busca de hotéis
       * @example cy.fillSearchForm('São Paulo', '2025-12-01', '2025-12-05', 2, 1)
       */
      fillSearchForm(
        destination: string,
        checkIn: string,
        checkOut: string,
        guests: number,
        rooms: number
      ): Chainable<void>;

      /**
       * Preencher formulário de reserva
       * @example cy.fillBookingForm(bookingData)
       */
      fillBookingForm(data: {
        name: string;
        email: string;
        phone: string;
        cpf: string;
        cardNumber: string;
        cardName: string;
        cardExpiry: string;
        cardCvv: string;
      }): Chainable<void>;

      /**
       * Verificar se está autenticado
       * @example cy.checkAuthenticated()
       */
      checkAuthenticated(): Chainable<void>;

      /**
       * Verificar se não está autenticado
       * @example cy.checkNotAuthenticated()
       */
      checkNotAuthenticated(): Chainable<void>;
      /**
       * Login using session
       * @example cy.loginBySession('user@example.com', 'password123')
       */
      loginBySession(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should("not.include", "/login");
});

Cypress.Commands.add("logout", () => {
  cy.get("button")
    .contains(/sair|logout/i)
    .click();
  cy.url().should("include", "/");
});

Cypress.Commands.add(
  "fillSearchForm",
  (
    destination: string,
    checkIn: string,
    checkOut: string,
    guests: number | string,
    rooms: number | string
  ) => {
    cy.get('[data-testid="destination"]').clear().type(destination);
    cy.get('[data-testid="checkin"]').clear().type(checkIn);
    cy.get('[data-testid="checkout"]').clear().type(checkOut);
    cy.get('select[data-testid="guests"]').select(String(guests));
    cy.get('select[data-testid="rooms"]').select(String(rooms));
  }
);

Cypress.Commands.add("fillBookingForm", (data) => {
  cy.get('input[name="name"], input[placeholder*="nome" i]').type(data.name);
  cy.get('input[name="email"], input[type="email"]').type(data.email);
  cy.get('input[name="phone"], input[placeholder*="telefone" i]').type(
    data.phone
  );
  cy.get('input[name="cpf"], input[placeholder*="cpf" i]').type(data.cpf);
  cy.get('input[name="cardNumber"], input[placeholder*="cartão" i]').type(
    data.cardNumber
  );
  cy.get('input[name="cardName"], input[placeholder*="titular" i]').type(
    data.cardName
  );
  cy.get('input[name="cardExpiry"], input[placeholder*="validade" i]').type(
    data.cardExpiry
  );
  cy.get('input[name="cardCvv"], input[placeholder*="cvv" i]').type(
    data.cardCvv
  );
});

Cypress.Commands.add("checkAuthenticated", () => {
  cy.window().its("localStorage.auth").should("exist");
});

Cypress.Commands.add("checkNotAuthenticated", () => {
  cy.window().its("localStorage.auth").should("not.exist");
});

export {};
