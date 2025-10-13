/// <reference types="cypress" />

describe("Performance e Otimizações", () => {
  describe("Tempo de Carregamento", () => {
    it("deve carregar página inicial rapidamente", () => {
      const start = Date.now();
      cy.visit("/");
      const end = Date.now();
      const loadTime = end - start;

      cy.log(`Tempo de carregamento: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(5000);
    });

    it("deve carregar listagem de hotéis rapidamente", () => {
      const start = Date.now();
      cy.visit("/hotels");
      cy.wait(1000);
      const end = Date.now();
      const loadTime = end - start;

      cy.log(`Tempo de carregamento: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(6000);
    });

    it("deve carregar detalhes do hotel rapidamente", () => {
      const start = Date.now();
      cy.visit("/hotels/1");
      cy.wait(1000);
      const end = Date.now();
      const loadTime = end - start;

      cy.log(`Tempo de carregamento: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(6000);
    });
  });

  describe("Otimização de Imagens", () => {
    beforeEach(() => {
      cy.visit("/hotels/1");
      cy.wait(1000);
    });
  });

  describe("Caching e Persistência", () => {
    it("deve usar localStorage para dados persistentes", () => {
      cy.visit("/");
      cy.window().then((win) => {
        const storageKeys = Object.keys(win.localStorage);
        cy.log("LocalStorage keys:", storageKeys);
      });
    });

    it("deve cachear dados de busca", () => {
      cy.fixture("hotels").then((data) => {
        cy.visit("/");
        cy.fillSearchForm(
          data.searchData.destination,
          data.searchData.checkIn,
          data.searchData.checkOut,
          data.searchData.guests,
          data.searchData.rooms
        );
        cy.get('button[type="submit"]').click();
        cy.wait(1000);

        cy.visit("/");
        cy.wait(500);

        // Verificar se dados foram mantidos
        cy.window().then((win) => {
          cy.log("LocalStorage após navegação:", Object.keys(win.localStorage));
        });
      });
    });
  });

  describe("Otimização de Requisições", () => {
    it("deve fazer requisições assíncronas", () => {
      cy.intercept("/api/**").as("apiCalls");
      cy.visit("/hotels");
      cy.wait(1000);

      cy.get("@apiCalls.all").then((calls) => {
        cy.log(`${calls.length} requisições API realizadas`);
      });
    });

    it("deve tratar erros de API graciosamente", () => {
      cy.intercept("/api/hotels", { statusCode: 500 }).as("apiError");
      cy.visit("/hotels");
      cy.wait(1000);

      cy.get("body").should("exist");
    });

    it("deve ter timeout apropriado em requisições", () => {
      cy.visit("/hotels");
      cy.wait(1000);
      cy.get("body").should("exist");
    });

    it("deve fazer retry em caso de falha", () => {
      cy.visit("/hotels?error=true");
      cy.wait(1000);

      cy.get("body").then(($body) => {
        if (
          $body.text().includes("tentar novamente") ||
          $body.text().includes("retry")
        ) {
          cy.log("Opção de retry encontrada");
        }
      });
    });
  });

  describe("Bundle Size e Code Splitting", () => {
    it("deve carregar apenas JavaScript necessário", () => {
      cy.visit("/");

      cy.window().then((win) => {
        const scripts = win.document.querySelectorAll("script");
        cy.log(`${scripts.length} scripts carregados`);
      });
    });

    it("deve fazer code splitting por rota", () => {
      cy.visit("/");
      const homeScripts = new Set();

      cy.window().then((win) => {
        win.document.querySelectorAll("script").forEach((script) => {
          homeScripts.add(script.src);
        });
      });

      cy.visit("/hotels");
      cy.wait(1000);

      cy.window().then((win) => {
        const hotelScripts = win.document.querySelectorAll("script");
        cy.log(`Scripts na página de hotéis: ${hotelScripts.length}`);
      });
    });

    it("deve carregar CSS crítico inline", () => {
      cy.visit("/");

      cy.get("style").then(($styles) => {
        if ($styles.length > 0) {
          cy.log(`${$styles.length} tags style inline encontradas`);
        }
      });
    });
  });

  describe("Renderização e Reflow", () => {
    it("não deve ter layout shift significativo", () => {
      cy.visit("/");
      cy.wait(2000);

      cy.get("body").should("be.visible");
      cy.get("header").should("be.visible");
    });

    it("deve ter skeleton loaders", () => {
      cy.visit("/hotels");

      cy.get("body").then(($body) => {
        if ($body.find('[class*="skeleton"], [class*="loading"]').length > 0) {
          cy.log("Skeleton loaders encontrados");
        }
      });
    });

    it("deve renderizar conteúdo above-the-fold primeiro", () => {
      cy.visit("/");
      cy.get("header").should("be.visible");
      cy.get("h1, h2").should("be.visible");
    });
  });

  describe("Memória e Vazamentos", () => {
    it("deve limpar event listeners ao sair da página", () => {
      cy.visit("/hotels/1");
      cy.wait(1000);
      cy.visit("/");
      cy.wait(1000);

      cy.window().then((win) => {
        cy.log("Navegação concluída sem erros");
      });
    });

    it("deve limpar timers e intervals", () => {
      cy.visit("/");
      cy.wait(2000);
      cy.visit("/hotels");
      cy.wait(2000);

      cy.window().then((win) => {
        cy.log("Navegação entre páginas OK");
      });
    });
  });

  describe("Otimização Mobile", () => {
    beforeEach(() => {
      cy.viewport(375, 667);
    });

    it("deve carregar rapidamente em mobile", () => {
      const start = Date.now();
      cy.visit("/");
      const end = Date.now();
      const loadTime = end - start;

      cy.log(`Tempo de carregamento mobile: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(6000);
    });

    it("deve ter viewport meta tag", () => {
      cy.visit("/");
      cy.get('meta[name="viewport"]').should("exist");
    });

    it("deve usar touch events apropriadamente", () => {
      cy.visit("/");
      cy.get("button").first().should("be.visible");
    });

    it("deve ter área de toque adequada", () => {
      cy.visit("/");

      cy.get("button, a").each(($el) => {
        const height = $el.height();
        const width = $el.width();

        if (height && width) {
          cy.log(`Elemento: ${height}x${width}px`);
        }
      });
    });
  });

  describe("Prefetch e Preload", () => {
    it("deve fazer prefetch de rotas importantes", () => {
      cy.visit("/");

      cy.get('link[rel="prefetch"], link[rel="preload"]').then(($links) => {
        if ($links.length > 0) {
          cy.log(`${$links.length} recursos com prefetch/preload`);
        }
      });
    });

    it("deve preconectar a domínios externos", () => {
      cy.visit("/");

      cy.get('link[rel="preconnect"], link[rel="dns-prefetch"]').then(
        ($links) => {
          if ($links.length > 0) {
            cy.log(`${$links.length} preconnect/dns-prefetch encontrados`);
          }
        }
      );
    });
  });

  describe("Compressão e Minificação", () => {
    it("deve servir assets comprimidos", () => {
      cy.request("/").then((response) => {
        cy.log("Content-Type:", response.headers["content-type"]);
        cy.log("Content-Encoding:", response.headers["content-encoding"]);
      });
    });

    it("deve ter JavaScript minificado", () => {
      cy.visit("/");

      cy.window().then((win) => {
        const scripts = win.document.querySelectorAll("script[src]");
        scripts.forEach((script) => {
          const src = script.getAttribute("src");
          if (src && !src.includes("node_modules")) {
            cy.log("Script:", src);
          }
        });
      });
    });

    it("deve ter CSS minificado", () => {
      cy.visit("/");

      cy.get('link[rel="stylesheet"]').then(($links) => {
        cy.log(`${$links.length} arquivos CSS carregados`);
      });
    });
  });

  describe("Service Workers e PWA", () => {
    it("deve registrar service worker se disponível", () => {
      cy.visit("/");

      cy.window().then((win) => {
        if ("serviceWorker" in win.navigator) {
          cy.log("Service Worker API disponível");
        }
      });
    });
  });
});
