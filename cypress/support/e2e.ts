// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-plugin-tab";

const DEMO = { email: "user@demo.com", password: "123456" } as const;
export const SESSION_ID = `ui-${DEMO.email}`;

export function loginUI() {
  cy.visit("/login");
  cy.get('input[type="email"]').type(DEMO.email);
  cy.get('input[type="password"]').type(DEMO.password);
  cy.get('button[type="submit"]').click();
  cy.location("pathname").should("not.eq", "/login");
}

export function validateSession() {
  cy.getCookie("auth-token").should("exist");
}

// object literal criado UMA vez, fora de hooks:
export const SESSION_OPTIONS: Cypress.SessionOptions = {
  cacheAcrossSpecs: true,
  validate: validateSession,
};
