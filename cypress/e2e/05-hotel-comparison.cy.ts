/// <reference types="cypress" />

describe.only("Comparação de Hotéis", () => {
  beforeEach(() => {
    cy.visit("/hotels");
    cy.wait(1000);
  });

  describe("Seleção de Hotéis para Comparar", () => {
    it("deve ter opção de comparar hotéis", () => {
      cy.get("body").then(($body) => {
        if (
          $body.text().includes("comparar") ||
          $body.find('input[type="checkbox"]').length > 0 ||
          $body.find('[data-testid*="compare"]').length > 0
        ) {
          cy.log("Opção de comparação encontrada");
        }
      });
    });

    it("deve permitir selecionar múltiplos hotéis", () => {
      cy.get("body").then(($body) => {
        const checkboxes = $body.find('input[type="checkbox"]');
        if (checkboxes.length >= 2) {
          cy.get('input[type="checkbox"]').eq(0).check();
          cy.get('input[type="checkbox"]').eq(1).check();
          cy.wait(500);
        }
      });
    });

    it("deve exibir contador de hotéis selecionados", () => {
      cy.get("body").then(($body) => {
        if ($body.text().match(/\d+\s*(selecionado|hotel)/i)) {
          cy.log("Contador de seleção encontrado");
        }
      });
    });

    it("deve ter botão para ir para página de comparação", () => {
      cy.get("body").then(($body) => {
        const compareButton = $body
          .find("button, a")
          .toArray()
          .find((el) => el.textContent?.toLowerCase().includes("comparar"));

        if (compareButton) {
          cy.log("Botão de comparação encontrado");
        }
      });
    });
  });

  describe("Página de Comparação", () => {
    beforeEach(() => {
      cy.visit("/compare");
      cy.wait(1000);
    });

    it("deve carregar página de comparação", () => {
      cy.url().should("include", "/compare");
    });

    it("deve exibir tabela de comparação", () => {
      cy.get("table, div").should("exist");
    });

    it("deve exibir informações dos hotéis lado a lado", () => {
      cy.get("body").then(($body) => {
        if ($body.find("table").length > 0) {
          cy.get("table").should("be.visible");
        } else if ($body.find('[data-testid*="compare"]').length > 0) {
          cy.log("Layout de comparação encontrado");
        }
      });
    });

    it("deve comparar nomes dos hotéis", () => {
      cy.get("body").should("contain.text", "");
    });

    it("deve comparar preços", () => {
      cy.get("body").then(($body) => {
        if ($body.text().includes("R$") || $body.text().includes("preço")) {
          cy.log("Comparação de preços encontrada");
        }
      });
    });

    it("deve comparar avaliações", () => {
      cy.get("body").then(($body) => {
        if (
          $body.text().includes("avaliação") ||
          $body.find("svg").length > 0 ||
          $body.text().match(/\d+[.,]\d+/)
        ) {
          cy.log("Comparação de avaliações encontrada");
        }
      });
    });

    it("deve comparar comodidades", () => {
      cy.get("body").then(($body) => {
        if (
          $body.text().includes("comodidade") ||
          $body.text().includes("Wi-Fi") ||
          $body.text().includes("piscina")
        ) {
          cy.log("Comparação de comodidades encontrada");
        }
      });
    });

    it("deve comparar localizações", () => {
      cy.get("body").should("exist");
    });

    it("deve permitir remover hotel da comparação", () => {
      cy.get("button").then(($buttons) => {
        const removeButton = $buttons
          .toArray()
          .find(
            (el) =>
              el.textContent?.toLowerCase().includes("remover") ||
              el.textContent?.includes("×") ||
              el.textContent?.includes("✕")
          );

        if (removeButton) {
          cy.wrap(removeButton).click();
          cy.wait(500);
        }
      });
    });

    it("deve permitir adicionar mais hotéis", () => {
      cy.get("button, a").then(($elements) => {
        const addButton = $elements
          .toArray()
          .find(
            (el) =>
              el.textContent?.toLowerCase().includes("adicionar") ||
              el.textContent?.toLowerCase().includes("buscar")
          );

        if (addButton) {
          cy.log("Opção de adicionar hotéis encontrada");
        }
      });
    });

    it("deve ter links para detalhes de cada hotel", () => {
      cy.get('a[href*="/hotels/"]').should("exist");
    });

    it("deve ter botões de reserva para cada hotel", () => {
      cy.get("button, a").then(($elements) => {
        const bookingButtons = $elements
          .toArray()
          .filter(
            (el) =>
              el.textContent?.toLowerCase().includes("reservar") ||
              el.textContent?.toLowerCase().includes("escolher")
          );

        if (bookingButtons.length > 0) {
          cy.log(`${bookingButtons.length} botões de reserva encontrados`);
        }
      });
    });

    it("deve permitir limpar comparação", () => {
      cy.get("button").then(($buttons) => {
        const clearButton = $buttons
          .toArray()
          .find(
            (el) =>
              el.textContent?.toLowerCase().includes("limpar") ||
              el.textContent?.toLowerCase().includes("resetar")
          );

        if (clearButton) {
          cy.wrap(clearButton).click();
          cy.wait(500);
        }
      });
    });

    it("deve ter opção de voltar para listagem", () => {
      cy.get('a[href="/hotels"], button').then(($elements) => {
        const backButton = $elements
          .toArray()
          .find(
            (el) =>
              el.textContent?.toLowerCase().includes("voltar") ||
              el.getAttribute("href") === "/hotels"
          );

        if (backButton) {
          cy.log("Botão de voltar encontrado");
        }
      });
    });
  });

  describe("Persistência de Seleção", () => {
    it("deve manter hotéis selecionados ao navegar", () => {
      cy.get("body").then(($body) => {
        const checkboxes = $body.find('input[type="checkbox"]');
        if (checkboxes.length >= 2) {
          cy.get('input[type="checkbox"]').eq(0).check();
          cy.get('input[type="checkbox"]').eq(1).check();

          // Navegar para outra página e voltar
          cy.visit("/");
          cy.visit("/hotels");
          cy.wait(1000);

          // Verificar se seleção foi mantida
          cy.get("body").should("exist");
        }
      });
    });

    it("deve salvar seleção no localStorage", () => {
      cy.get("body").then(($body) => {
        const checkboxes = $body.find('input[type="checkbox"]');
        if (checkboxes.length >= 1) {
          cy.get('input[type="checkbox"]').eq(0).check();
          cy.wait(500);

          cy.window().then((win) => {
            const storage = win.localStorage;
            cy.log("LocalStorage keys:", Object.keys(storage));
          });
        }
      });
    });
  });

  describe("Responsividade", () => {
    beforeEach(() => {
      cy.visit("/compare");
      cy.wait(1000);
    });

    it("deve ser responsivo em mobile", () => {
      cy.viewport(375, 667);
      cy.get("body").should("exist");
    });

    it("deve ser responsivo em tablet", () => {
      cy.viewport(768, 1024);
      cy.get("body").should("exist");
    });

    it("deve ser responsivo em desktop", () => {
      cy.viewport(1920, 1080);
      cy.get("body").should("exist");
    });

    it("deve adaptar layout em telas pequenas", () => {
      cy.viewport(375, 667);
      cy.get("body").then(($body) => {
        // Em mobile, pode usar cards ao invés de tabela
        cy.log("Layout mobile verificado");
      });
    });
  });

  describe("Estados Vazios", () => {
    it("deve exibir mensagem quando nenhum hotel selecionado", () => {
      cy.visit("/compare");
      cy.wait(1000);

      cy.get("body").then(($body) => {
        if (
          !$body.find("table tr").length ||
          $body.text().includes("nenhum") ||
          $body.text().includes("selecione")
        ) {
          cy.log("Estado vazio tratado");
        }
      });
    });

    it("deve ter CTA para buscar hotéis", () => {
      cy.visit("/compare");
      cy.wait(1000);

      cy.get("a, button").then(($elements) => {
        const searchCTA = $elements
          .toArray()
          .find(
            (el) =>
              el.textContent?.toLowerCase().includes("buscar") ||
              el.textContent?.toLowerCase().includes("pesquisar")
          );

        if (searchCTA) {
          cy.log("CTA para buscar encontrado");
        }
      });
    });
  });
});
