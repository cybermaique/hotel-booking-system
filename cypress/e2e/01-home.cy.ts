/// <reference types="cypress" />

describe("Página Inicial", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("deve carregar a página inicial corretamente", () => {
    cy.url().should("eq", Cypress.config().baseUrl + "/");
    cy.get("h1, h2").should("be.visible");
  });

  it("deve exibir o header com navegação", () => {
    cy.get("header").should("be.visible");
    cy.get("nav").should("exist");
  });

  it("deve exibir o formulário de busca", () => {
    cy.get('[data-testid="search-form"]').should("be.visible");

    cy.get('[data-testid="destination"]').should("be.visible");

    cy.get('[data-testid="checkin"]').should("be.visible");
    cy.get('[data-testid="checkout"]').should("be.visible");

    cy.get('[data-testid="rooms"]').should("exist");
    cy.get('[data-testid="guests"]').should("exist");

    cy.get('[data-testid="submit-search"]').should("be.visible");
  });

  it("deve ter links de navegação funcionais", () => {
    cy.get('a[href="/"]').should("exist");
    cy.get('a[href*="hotel"]').should("exist");
  });

  it("deve ser responsivo", () => {
    // Desktop
    cy.viewport(1280, 720);
    cy.get("header").should("be.visible");

    // Tablet
    cy.viewport(768, 1024);
    cy.get("header").should("be.visible");

    // Mobile
    cy.viewport(375, 667);
    cy.get("header").should("be.visible");
  });

  it("deve ter elementos acessíveis", () => {
    cy.get("button").each(($btn) => {
      cy.wrap($btn).should("have.attr", "type");
    });

    cy.get("input").each(($input) => {
      cy.wrap($input).should(
        ($el) =>
          expect(
            $el.attr("placeholder") ||
              $el.attr("aria-label") ||
              $el.attr("name")
          ).to.be.ok
      );
    });
  });

  it("deve permitir navegação por teclado", () => {
    cy.get("body").tab();
    cy.focused().should("exist");
  });
});
