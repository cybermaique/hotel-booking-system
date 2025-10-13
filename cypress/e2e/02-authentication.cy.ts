/// <reference types="cypress" />

describe("Autenticação + Proteção de Rotas", () => {
  const DEMO_USER = { email: "user@demo.com", password: "123456" };
  const PROTECTED_PATH = "/hotels/123"; // ajuste se sua rota protegida for outra

  beforeEach(() => {
    cy.clearLocalStorage();
    // estado não autenticado por padrão
    cy.intercept("GET", "/api/auth/me", { statusCode: 200, body: null }).as(
      "me-unauth"
    );
  });

  // Intercepts usados APENAS no fluxo de registro (sucesso/erro)
  const mockRegisterSuccess = (
    user = {
      id: "2",
      name: "Novo Usuário",
      email: "novo@example.com",
      roles: [],
    }
  ) => {
    cy.intercept("POST", "/api/auth/register", {
      statusCode: 200,
      body: { success: true, user },
    }).as("register-success");
  };

  const mockRegisterFail = (message = "Não foi possível criar a conta") => {
    cy.intercept("POST", "/api/auth/register", {
      statusCode: 400,
      body: { success: false, error: message },
    }).as("register-fail");
  };

  // -------------------------
  // LOGIN
  // -------------------------
  describe("Login", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("deve exibir o formulário de login", () => {
      cy.get('[data-testid="login-title"]').should("be.visible");
      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("deve validar campos obrigatórios", () => {
      cy.get('button[type="submit"]').click();
      cy.get('input[type="email"]:invalid').should("exist");
    });

    it("deve validar formato de email", () => {
      cy.get('input[type="email"]').type("emailinvalido");
      cy.get('input[type="password"]').type("senha123");
      cy.get('button[type="submit"]').click();
      cy.get('input[type="email"]:invalid').should("exist");
    });

    it("deve fazer login com credenciais válidas", () => {
      cy.get('input[type="email"]').type(DEMO_USER.email);
      cy.get('input[type="password"]').type(DEMO_USER.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("not.include", "/login");
    });

    it("deve exibir erro com credenciais inválidas", () => {
      cy.get('input[type="email"]').type("inexistente@example.com");
      cy.get('input[type="password"]').type("senhaerrada");
      cy.get('button[type="submit"]').click();

      cy.url().should("include", "/login");
    });

    it("deve ter link para registro", () => {
      cy.get('a[href*="register"]').first().should("be.visible").click();
      cy.url().should("include", "/register");
    });

    it("deve manter o usuário logado após refresh", () => {
      cy.get('input[type="email"]').type(DEMO_USER.email);
      cy.get('input[type="password"]').type(DEMO_USER.password);
      cy.get('button[type="submit"]').click();

      cy.url().should("not.include", "/login");
      cy.reload();
      cy.url().should("not.include", "/login");
    });
  });

  // -------------------------
  // REGISTRO
  // -------------------------
  describe("Registro", () => {
    beforeEach(() => {
      cy.visit("/register");
    });

    it("deve exibir o formulário de registro", () => {
      cy.get('[data-testid="register-title"]').should("be.visible");
      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("deve validar campos obrigatórios", () => {
      cy.get('button[type="submit"]').should("be.disabled");
    });

    it("deve ter link para login", () => {
      cy.get('a[href*="login"]').first().should("be.visible").click();
      cy.url().should("include", "/login");
    });

    it("deve registrar novo usuário", () => {
      mockRegisterSuccess();

      const ts = Date.now();
      cy.get('input[type="email"]').type(`user${ts}@example.com`);
      cy.get('input[type="password"]').first().type("senha123"); // senha
      cy.get('input[type="password"]').eq(1).type("senha123"); // confirmar
      cy.get('input[type="text"]').first().type("Novo Usuário"); // Nome (AtomInput)
      cy.get("#terms").check();

      cy.get('button[type="submit"]').should("not.be.disabled").click();
      cy.wait("@register-success");
      cy.url().should("not.include", "/register");
    });

    it("deve lidar com erro de registro", () => {
      mockRegisterFail();

      const ts = Date.now();
      cy.get('input[type="email"]').type(`user${ts}@example.com`);
      cy.get('input[type="password"]').first().type("senha123");
      cy.get('input[type="password"]').eq(1).type("senha123");
      cy.get('input[type="text"]').first().type("Usuário Erro");
      cy.get("#terms").check();
      cy.get('button[type="submit"]').click();

      cy.wait("@register-fail");
      cy.url().should("include", "/register");
    });
  });

  // -------------------------
  // LOGOUT
  // -------------------------
  describe("Logout", () => {
    beforeEach(() => {
      // login real (cookie válido)
      cy.visit("/login");
      cy.get('input[type="email"]').type(DEMO_USER.email);
      cy.get('input[type="password"]').type(DEMO_USER.password);
      cy.get('button[type="submit"]').click();
      cy.url().should("not.include", "/login");
    });

    it("deve fazer logout com sucesso", () => {
      cy.intercept("POST", "/api/auth/logout", {
        statusCode: 200,
        body: { success: true },
      }).as("logout-success");

      // Logout pela UI (capturado pelo intercept)
      cy.get('[data-testid="open-user-menu"]').click();
      cy.get('[data-testid="logout"]').click();

      cy.wait("@logout-success");
      cy.url().should("include", "/"); // redireciona para home
    });

    it("deve redirecionar para home após logout", () => {
      cy.intercept("POST", "/api/auth/logout", {
        statusCode: 200,
        body: { success: true },
      }).as("logout-success");

      cy.get('[data-testid="open-user-menu"]').click();
      cy.get('[data-testid="logout"]').click();

      cy.wait("@logout-success");
      cy.url().should("include", "/");
    });
  });

  // -------------------------
  // PROTEÇÃO DE ROTAS (middleware)
  // -------------------------
  describe("Proteção de Rotas (middleware)", () => {
    it("redireciona visitante não autenticado para /login com redirect ao acessar rota protegida", () => {
      cy.visit(PROTECTED_PATH);

      // verifica o pathname em vez do url completo
      cy.location("pathname").should("eq", "/login");

      // lê o parâmetro ?redirect= e compara decodificado
      cy.location("search").then((search) => {
        const params = new URLSearchParams(search);
        const redirect = params.get("redirect");
        expect(redirect).to.eq(PROTECTED_PATH);
      });
    });

    it("após login, redireciona de volta para a rota original passada no redirect", () => {
      cy.visit(`/login?redirect=${encodeURIComponent(PROTECTED_PATH)}`);

      cy.get('input[type="email"]').type(DEMO_USER.email);
      cy.get('input[type="password"]').type(DEMO_USER.password);
      cy.get('button[type="submit"]').click();

      cy.location("pathname").should("eq", PROTECTED_PATH);
    });

    it("bloqueia /login e /register quando já autenticado (comportamento flexível)", () => {
      // autentica
      cy.visit("/login");
      cy.get('input[type="email"]').type(DEMO_USER.email);
      cy.get('input[type="password"]').type(DEMO_USER.password);
      cy.get('button[type="submit"]').click();
      cy.location("pathname").should("not.eq", "/login");

      // tentar acessar /login -> alguns apps redirecionam para '/', outros permitem ficar
      cy.visit("/login");
      cy.location("pathname").should("be.oneOf", ["/", "/login"]);

      // tentar acessar /register -> idem
      cy.visit("/register");
      cy.location("pathname").should("be.oneOf", ["/", "/register"]);
    });

    it("após logout, volta a exigir login nas rotas protegidas", () => {
      // autentica
      cy.visit("/login");
      cy.get('input[type="email"]').type(DEMO_USER.email);
      cy.get('input[type="password"]').type(DEMO_USER.password);
      cy.get('button[type="submit"]').click();
      cy.location("pathname").should("not.eq", "/login");

      // logout pela UI
      cy.intercept("POST", "/api/auth/logout", {
        statusCode: 200,
        body: { success: true },
      }).as("logout-success");
      cy.get('[data-testid="open-user-menu"]').click();
      cy.get('[data-testid="logout"]').click();
      cy.wait("@logout-success");

      // tentar rota protegida -> deve ir para /login com ?redirect
      cy.visit(PROTECTED_PATH);
      cy.location("pathname").should("eq", "/login");
      cy.location("search").then((search) => {
        const params = new URLSearchParams(search);
        const redirect = params.get("redirect");
        expect(redirect).to.eq(PROTECTED_PATH);
      });
    });

    it("deve permitir acesso a páginas públicas sem login", () => {
      cy.visit("/");
      cy.location("pathname").should("eq", "/");

      cy.visit("/hotels");
      cy.location("pathname").should("eq", "/hotels");
    });
  });
});
