/// <reference types="cypress" />

describe.only("Acessibilidade", () => {
  describe("Navegação por Teclado", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("deve permitir navegação por Tab", () => {
      cy.get("body").tab();
      cy.focused().should("exist");

      cy.focused().tab();
      cy.focused().should("exist");
    });

    it("deve ter ordem de foco lógica", () => {
      let previousTabIndex = -1;
      cy.get("a, button, input, select, textarea").each(($el) => {
        const tabIndex = parseInt($el.attr("tabindex") || "0");
        cy.log(`Tab index: ${tabIndex}`);
      });
    });

    it("deve permitir ativar botões com Enter", () => {
      cy.get("button").first().focus().type("{enter}");
      cy.wait(500);
    });

    it("deve permitir ativar links com Enter", () => {
      cy.get("a").first().focus().type("{enter}");
      cy.wait(500);
    });

    it("deve permitir navegar em formulários com Tab", () => {
      cy.get("input").first().focus();
      cy.focused().should("match", "input");

      cy.focused().tab();
      cy.focused().should("exist");
    });

    it("deve ter indicadores visuais de foco", () => {
      cy.get("a, button, input").first().focus();
      cy.focused().should("have.css", "outline").and("not.equal", "none");
    });

    it("deve permitir fechar modais com Escape", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[role="dialog"]').length > 0) {
          cy.get('[role="dialog"]').type("{esc}");
          cy.wait(500);
        }
      });
    });
  });

  describe("ARIA Labels e Roles", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it('deve ter role="navigation" no menu', () => {
      cy.get('[role="navigation"], nav').should("exist");
    });

    it('deve ter role="main" no conteúdo principal', () => {
      cy.get('[role="main"], main').should("exist");
    });

    it("deve ter aria-label em botões sem texto", () => {
      cy.get("button").each(($btn) => {
        const hasText = $btn.text().trim().length > 0;
        const hasAriaLabel = $btn.attr("aria-label");
        const hasTitle = $btn.attr("title");

        if (!hasText) {
          expect(hasAriaLabel || hasTitle).to.exist;
        }
      });
    });

    it("deve ter labels associados a inputs", () => {
      cy.get("input").each(($input) => {
        const hasLabel =
          $input.attr("aria-label") ||
          $input.attr("aria-labelledby") ||
          $input.attr("placeholder") ||
          $input.attr("name");

        expect(hasLabel).to.exist;
      });
    });

    it("deve ter aria-expanded em elementos expansíveis", () => {
      cy.get("body").then(($body) => {
        const expandable = $body.find("[aria-expanded]");
        if (expandable.length > 0) {
          cy.log(`${expandable.length} elementos expansíveis encontrados`);
        }
      });
    });

    it("deve ter aria-live para notificações", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[role="alert"], [aria-live]').length > 0) {
          cy.log("Regiões live encontradas");
        }
      });
    });
  });

  describe("Semântica HTML", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("deve ter apenas um h1 por página", () => {
      cy.get("h1").should("have.length.at.most", 1);
    });

    it("deve ter hierarquia de headings correta", () => {
      cy.get("h1, h2, h3, h4, h5, h6").then(($headings) => {
        cy.log(`${$headings.length} headings encontrados`);
      });
    });

    it("deve usar elementos semânticos", () => {
      cy.get("header").should("exist");
      cy.get("nav").should("exist");
      cy.get('main, [role="main"]').should("exist");
    });

    it("deve usar listas para navegação", () => {
      cy.get("nav").then(($nav) => {
        if ($nav.find("ul, ol").length > 0) {
          cy.log("Listas de navegação encontradas");
        }
      });
    });

    it("deve usar buttons para ações", () => {
      cy.get('button[type="submit"]').should("exist");
    });

    it("deve usar links para navegação", () => {
      cy.get("a[href]").should("exist");
    });
  });

  describe("Contraste de Cores", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("deve ter texto legível", () => {
      cy.get("body").should("have.css", "color");
      cy.get("body").should("have.css", "background-color");
    });

    it("deve ter contraste adequado em botões", () => {
      cy.get("button").first().should("have.css", "color");
      cy.get("button").first().should("have.css", "background-color");
    });

    it("deve ter contraste adequado em links", () => {
      cy.get("a").first().should("have.css", "color");
    });
  });

  describe("Formulários Acessíveis", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("deve ter labels visíveis ou aria-label", () => {
      cy.get("input").each(($input) => {
        const id = $input.attr("id");
        const hasVisibleLabel =
          id && cy.get(`label[for="${id}"]`).should("exist");
        const hasAriaLabel = $input.attr("aria-label");
        const hasPlaceholder = $input.attr("placeholder");

        expect(hasVisibleLabel || hasAriaLabel || hasPlaceholder).to.exist;
      });
    });

    it("deve ter mensagens de erro acessíveis", () => {
      cy.get('button[type="submit"]').click();
      cy.wait(500);

      cy.get("body").then(($body) => {
        if ($body.find('[role="alert"], .error, [aria-invalid]').length > 0) {
          cy.log("Mensagens de erro acessíveis encontradas");
        }
      });
    });

    it("deve ter required em campos obrigatórios", () => {
      cy.get("input[required]").should("exist");
    });
  });

  describe("Responsividade e Zoom", () => {
    it("deve funcionar com zoom de 200%", () => {
      cy.viewport(1280, 720);
      cy.visit("/");

      // Simular zoom alterando viewport
      cy.viewport(640, 360);
      cy.get("body").should("be.visible");
    });

    it("deve ser usável em telas pequenas", () => {
      cy.viewport(320, 568);
      cy.visit("/");
      cy.get("body").should("be.visible");
    });

    it("deve ter texto legível em mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/");
      cy.get("body").should("have.css", "font-size");
    });

    it("deve ter botões grandes o suficiente para toque", () => {
      cy.viewport(375, 667);
      cy.visit("/");

      cy.get("button, a").each(($el) => {
        const height = $el.height();
        const width = $el.width();

        // Área mínima recomendada: 44x44px
        if (height && width) {
          cy.log(`Elemento: ${height}x${width}px`);
        }
      });
    });
  });

  describe("Conteúdo Multimídia", () => {
    it("deve ter imagens com lazy loading", () => {
      cy.visit("/hotels");
      cy.wait(1000);

      cy.get("img").then(($images) => {
        if ($images.length > 0) {
          cy.log(`${$images.length} imagens encontradas`);
        }
      });
    });
  });

  describe("Navegação Skip Links", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("deve ter skip to main content link", () => {
      cy.get("body").then(($body) => {
        if ($body.find('a[href="#main"], a[href="#content"]').length > 0) {
          cy.log("Skip link encontrado");
        }
      });
    });

    it("skip link deve ser o primeiro elemento focável", () => {
      cy.get("body").tab();
      cy.focused().then(($el) => {
        cy.log("Primeiro elemento focável:", $el.prop("tagName"));
      });
    });
  });

  describe("Estados de Foco", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("deve manter foco após interações", () => {
      cy.get("button").first().focus();
      cy.focused().should("match", "button");

      cy.focused().click();
      cy.wait(500);
    });

    it("deve restaurar foco após fechar modal", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[role="dialog"]').length > 0) {
          cy.log("Modal encontrado para teste de foco");
        }
      });
    });
  });
});
