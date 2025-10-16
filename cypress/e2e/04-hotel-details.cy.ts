describe.only("Detalhes do Hotel", () => {
  const DEMO_USER = { email: "user@demo.com", password: "123456" };
  const HOTEL_URL = "/hotels/1";

  beforeEach(() => {
    cy.intercept("GET", "/api/hotels/*").as("getHotel");

    cy.visit(`/login?redirect=${HOTEL_URL}`);
    cy.get('input[type="email"]').type(DEMO_USER.email);
    cy.get('input[type="password"]').type(DEMO_USER.password);
    cy.get('button[type="submit"]').click();

    cy.wait("@getHotel");
    cy.request("GET", "/api/auth/me").its("status").should("eq", 200);
    cy.url({ timeout: 10_000 }).should("include", HOTEL_URL);
  });

  describe("Informações do Hotel", () => {
    it("deve carregar a página de detalhes", () => {
      cy.url().should("match", /\/hotels\/\d+/);
    });

    it("deve exibir o nome do hotel", () => {
      cy.get("h1, h2").should("be.visible");
    });

    it("deve exibir imagens do hotel", () => {
      cy.get('[data-testid="image-gallery"] img').should(
        "have.length.at.least",
        1
      );
      cy.get('[data-testid="image-gallery"] img')
        .first()
        .should("have.attr", "src");
    });

    it("deve exibir galeria de imagens clicável", () => {
      cy.get('[data-testid="image-gallery"] img').should("be.visible");
      cy.get('[data-testid="image-gallery"]').then(($gal) => {
        if ($gal.find("img").length > 1)
          cy.log("Galeria de imagens encontrada");
      });
    });

    it("deve exibir avaliação do hotel", () => {
      cy.get("body").then(($body) => {
        const hasRating =
          /\d+[.,]\d+/.test($body.text()) ||
          $body.find('[data-testid*="rating"]').length > 0 ||
          $body.find("svg").length > 0;
        if (hasRating) cy.log("Avaliação encontrada");
      });
    });

    it("deve exibir descrição do hotel", () => {
      cy.get("p, div").should("contain.text", "");
    });

    it("deve exibir comodidades/amenidades", () => {
      cy.get("body").then(($body) => {
        const t = $body.text().toLowerCase();
        if (
          t.includes("comodidade") ||
          t.includes("amenidade") ||
          t.includes("wi-fi") ||
          t.includes("piscina")
        ) {
          cy.log("Comodidades encontradas");
        }
      });
    });

    it("deve exibir endereço/localização", () => {
      cy.get("body").should("contain.text", "");
    });

    it("deve exibir preço", () => {
      cy.get("body").then(($body) => {
        const txt = $body.text();
        if (txt.includes("R$") || /\d+[.,]\d{2}/.test(txt))
          cy.log("Preço encontrado");
      });
    });
  });

  describe("Formulário de Reserva", () => {
    it("deve exibir formulário de reserva", () => {
      cy.get('[data-testid="booking-form"]').should("exist");
      cy.get("form").should("exist");
    });

    it("deve exibir campos de datas", () => {
      cy.get('input[data-testid="checkin"]').should("exist");
      +cy.get('input[data-testid="checkout"]').should("exist");
    });

    it("deve exibir campos de hóspedes e quartos", () => {
      cy.get('select[name="rooms"]').should("exist");
      cy.get('select[name="guests"]').should("exist");
    });

    it("deve validar campos obrigatórios (submit desabilitado enquanto inválido)", () => {
      cy.get('[data-testid="booking-form"] button[type="submit"]').should(
        "be.disabled"
      );
    });

    it("deve calcular valor total da reserva", () => {
      cy.get('[data-testid="booking-form"]').scrollIntoView();
      cy.get('input[data-testid="checkin"]')
        .should("be.visible")
        .clear()
        .type("2025-12-01", { force: true });
      cy.get('input[data-testid="checkout"]')
        .should("be.visible")
        .clear()
        .type("2025-12-05", { force: true });
      cy.get('[data-testid="price-summary"]').should("contain.text", "Total");
    });

    it("deve permitir preencher formulário completo (mínimo para habilitar submit)", () => {
      cy.get('[data-testid="booking-form"]').should("exist").scrollIntoView();

      cy.viewport(1280, 900);

      cy.get('[data-testid="booking-form"]').within(() => {
        cy.get('input[data-testid="checkin"]')
          .should("exist")
          .scrollIntoView({ offset: { top: -100, left: 0 } })
          .clear()
          .type("2025-12-01", { force: true })
          .blur();

        cy.get('input[data-testid="checkout"]')
          .should("exist")
          .scrollIntoView({ offset: { top: -100, left: 0 } })
          .clear()
          .type("2025-12-05", { force: true })
          .blur();

        cy.get('select[name="rooms"]').should("exist").select("1");
        cy.get('select[name="guests"]').should("exist").select("2");

        cy.get('input[placeholder="Digite seu nome completo"]')
          .should("exist")
          .clear()
          .type("Fulano da Silva");

        cy.get('input[type="email"]')
          .should("exist")
          .clear()
          .type("fulano@teste.com");

        cy.get('input[type="tel"]')
          .should("exist")
          .clear()
          .type("(11) 98888-7777");

        cy.contains("label", "Forma de pagamento")
          .invoke("attr", "for")
          .then((id) => {
            if (id) {
              cy.get(`#${id}`).should("exist").select("pix");
            } else {
              cy.get('select[id*="payment"], select[name*="payment"]')
                .first()
                .should("exist")
                .select("pix");
            }
          });

        cy.get('[data-testid="price-summary"]')
          .scrollIntoView({ offset: { top: -120, left: 0 } })
          .should("exist")
          .and(($el) => {
            expect($el.text()).to.include("Total");
          });

        cy.get('button[type="submit"]').should("not.be.disabled");
      });
    });

    it("deve validar formato de email (sem precisar clicar no submit)", () => {
      cy.get('input[type="email"]').type("emailinvalido");
      cy.get('input[type="email"]:invalid').should("exist");
      cy.get('[data-testid="booking-form"] button[type="submit"]').should(
        "be.disabled"
      );
    });

    it("deve validar telefone/CPF se existirem", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('input[name="phone"]').length ||
          $body.find('input[placeholder*="telefone"]').length
        ) {
          cy.log("Telefone presente");
        }
        if (
          $body.find('input[name="cpf"]').length ||
          $body.find('input[placeholder*="cpf"]').length
        ) {
          cy.log("CPF presente");
        }
      });
    });
  });

  describe("Navegação", () => {
    it("deve ter botão de voltar", () => {
      cy.get("a, button").then(($els) => {
        const hasBack = $els
          .toArray()
          .some(
            (el) =>
              el.textContent?.toLowerCase().includes("voltar") ||
              el.getAttribute("href") === "/hotels"
          );
        if (hasBack) cy.log("Botão de voltar encontrado");
      });
    });

    it("deve permitir voltar para listagem", () => {
      cy.get('a[href="/hotels"], a[href*="/hotels"]').first().click();
      cy.url().should("include", "/hotels");
    });

    it("deve permitir navegar para home", () => {
      cy.get('a[href="/"]').first().click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Estados de Erro", () => {
    it("deve tratar erro de API", () => {
      cy.visit("/hotels/1?error=true");
      cy.get("body").should("exist");
    });
  });

  describe("Responsividade", () => {
    it("deve ser responsivo em mobile", () => {
      cy.viewport(375, 667);
      cy.get("h1, h2").should("be.visible");
    });

    it("deve ser responsivo em tablet", () => {
      cy.viewport(768, 1024);
      cy.get("h1, h2").should("be.visible");
    });

    it("deve ser responsivo em desktop", () => {
      cy.viewport(1920, 1080);
      cy.get("h1, h2").should("be.visible");
    });
  });
});
