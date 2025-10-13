import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "~/stores/auth";

const mockFetch = vi.fn();
global.$fetch = mockFetch as any;

const mockUser = {
  id: "1",
  name: "João Silva",
  email: "joao@example.com",
  roles: ["user"],
};

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockFetch.mockClear();
  });

  describe("Estado inicial", () => {
    it("deve ter estado inicial correto", () => {
      const store = useAuthStore();

      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.isLoading).toBe(false);
      expect(store.isInitialized).toBe(false);
    });
  });

  describe("Getters", () => {
    it("currentUser deve retornar usuário atual", () => {
      const store = useAuthStore();
      store.user = mockUser;

      expect(store.currentUser).toEqual(mockUser);
    });

    it("isLoggedIn deve retornar status de autenticação", () => {
      const store = useAuthStore();

      expect(store.isLoggedIn).toBe(false);

      store.isAuthenticated = true;
      expect(store.isLoggedIn).toBe(true);
    });

    it("userName deve retornar nome do usuário", () => {
      const store = useAuthStore();
      store.user = mockUser;

      expect(store.userName).toBe("João Silva");
    });

    it("userName deve retornar string vazia quando não há usuário", () => {
      const store = useAuthStore();

      expect(store.userName).toBe("");
    });

    it("userEmail deve retornar email do usuário", () => {
      const store = useAuthStore();
      store.user = mockUser;

      expect(store.userEmail).toBe("joao@example.com");
    });

    it("userEmail deve retornar string vazia quando não há usuário", () => {
      const store = useAuthStore();

      expect(store.userEmail).toBe("");
    });

    it("userRoles deve retornar roles do usuário", () => {
      const store = useAuthStore();
      store.user = mockUser;

      expect(store.userRoles).toEqual(["user"]);
    });

    it("userRoles deve retornar array vazio quando não há usuário", () => {
      const store = useAuthStore();

      expect(store.userRoles).toEqual([]);
    });

    it("hasRole deve verificar se usuário tem role específica", () => {
      const store = useAuthStore();
      store.user = { ...mockUser, roles: ["user", "admin"] };

      expect(store.hasRole("user")).toBe(true);
      expect(store.hasRole("admin")).toBe(true);
      expect(store.hasRole("superadmin")).toBe(false);
    });

    it("hasRole deve retornar false quando não há usuário", () => {
      const store = useAuthStore();

      expect(store.hasRole("user")).toBe(false);
    });
  });

  describe("initialize", () => {
    it("deve inicializar com usuário autenticado", async () => {
      mockFetch.mockResolvedValue(mockUser);
      const store = useAuthStore();

      await store.initialize();

      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
      expect(store.isInitialized).toBe(true);
    });

    it("deve inicializar sem usuário quando não autenticado", async () => {
      mockFetch.mockResolvedValue(null);
      const store = useAuthStore();

      await store.initialize();

      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.isInitialized).toBe(true);
    });

    it("deve lidar com erro na inicialização", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));
      const store = useAuthStore();

      await store.initialize();

      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(store.isInitialized).toBe(true);
    });

    it("não deve inicializar novamente se já inicializado", async () => {
      mockFetch.mockResolvedValue(mockUser);
      const store = useAuthStore();

      await store.initialize();
      expect(mockFetch).toHaveBeenCalledTimes(1);

      await store.initialize();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("deve definir isLoading durante inicialização", async () => {
      mockFetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockUser), 100))
      );
      const store = useAuthStore();

      expect(store.isLoading).toBe(false);

      const promise = store.initialize();
      expect(store.isLoading).toBe(true);

      await promise;
      expect(store.isLoading).toBe(false);
    });
  });

  describe("login", () => {
    it("deve fazer login com sucesso", async () => {
      mockFetch.mockResolvedValue({
        success: true,
        user: mockUser,
      });
      const store = useAuthStore();

      const result = await store.login("joao@example.com", "senha123");

      expect(result.success).toBe(true);
      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
    });

    it("deve retornar erro quando login falha", async () => {
      mockFetch.mockResolvedValue({
        success: false,
        error: "Credenciais inválidas",
      });
      const store = useAuthStore();

      const result = await store.login("joao@example.com", "senha-errada");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Credenciais inválidas");
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it("deve lidar com erro de rede", async () => {
      mockFetch.mockRejectedValue({
        data: { message: "Erro de conexão" },
      });
      const store = useAuthStore();

      const result = await store.login("joao@example.com", "senha123");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Erro de conexão");
    });

    it("deve definir isLoading durante login", async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true, user: mockUser }), 100)
          )
      );
      const store = useAuthStore();

      expect(store.isLoading).toBe(false);

      const promise = store.login("joao@example.com", "senha123");
      expect(store.isLoading).toBe(true);

      await promise;
      expect(store.isLoading).toBe(false);
    });

    it("deve chamar API com credenciais corretas", async () => {
      mockFetch.mockResolvedValue({ success: true, user: mockUser });
      const store = useAuthStore();

      await store.login("joao@example.com", "senha123");

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        body: { email: "joao@example.com", password: "senha123" },
      });
    });
  });

  describe("register", () => {
    it("deve registrar usuário com sucesso", async () => {
      mockFetch.mockResolvedValue({
        success: true,
        user: mockUser,
      });
      const store = useAuthStore();

      const result = await store.register(
        "João Silva",
        "joao@example.com",
        "senha123",
        "senha123"
      );

      expect(result.success).toBe(true);
      expect(store.user).toEqual(mockUser);
      expect(store.isAuthenticated).toBe(true);
    });

    it("deve retornar erro quando registro falha", async () => {
      mockFetch.mockResolvedValue({
        success: false,
        error: "Email já cadastrado",
      });
      const store = useAuthStore();

      const result = await store.register(
        "João Silva",
        "joao@example.com",
        "senha123",
        "senha123"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email já cadastrado");
    });

    it("deve lidar com erro de rede no registro", async () => {
      mockFetch.mockRejectedValue({
        data: { message: "Erro no servidor" },
      });
      const store = useAuthStore();

      const result = await store.register(
        "João Silva",
        "joao@example.com",
        "senha123",
        "senha123"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Erro no servidor");
    });

    it("deve chamar API com dados corretos", async () => {
      mockFetch.mockResolvedValue({ success: true, user: mockUser });
      const store = useAuthStore();

      await store.register(
        "João Silva",
        "joao@example.com",
        "senha123",
        "senha123"
      );

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        body: {
          name: "João Silva",
          email: "joao@example.com",
          password: "senha123",
          confirmPassword: "senha123",
        },
      });
    });
  });

  describe("logout", () => {
    it("deve fazer logout com sucesso", async () => {
      mockFetch.mockResolvedValue({});
      const store = useAuthStore();
      store.user = mockUser;
      store.isAuthenticated = true;

      const result = await store.logout();

      expect(result.success).toBe(true);
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it("deve limpar estado mesmo quando API falha", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));
      const store = useAuthStore();
      store.user = mockUser;
      store.isAuthenticated = true;

      const result = await store.logout();

      expect(result.success).toBe(false);
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it("deve chamar API de logout", async () => {
      mockFetch.mockResolvedValue({});
      const store = useAuthStore();

      await store.logout();

      expect(mockFetch).toHaveBeenCalledWith("/api/auth/logout", {
        method: "POST",
      });
    });
  });

  describe("refreshUser", () => {
    it("deve atualizar dados do usuário", async () => {
      const updatedUser = { ...mockUser, name: "João Silva Atualizado" };
      mockFetch.mockResolvedValue(updatedUser);
      const store = useAuthStore();

      await store.refreshUser();

      expect(store.user).toEqual(updatedUser);
      expect(store.isAuthenticated).toBe(true);
    });

    it("deve limpar usuário quando não autenticado", async () => {
      mockFetch.mockResolvedValue(null);
      const store = useAuthStore();
      store.user = mockUser;
      store.isAuthenticated = true;

      await store.refreshUser();

      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it("deve lidar com erro ao atualizar", async () => {
      mockFetch.mockRejectedValue(new Error("Error"));
      const store = useAuthStore();
      store.user = mockUser;
      store.isAuthenticated = true;

      await store.refreshUser();

      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });
  });
});
