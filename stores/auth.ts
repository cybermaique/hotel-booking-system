import { defineStore } from "pinia";

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

/**
 * Store Pinia para gerenciamento de autenticação.
 * 
 * Responsável por:
 * - Manter estado do usuário autenticado
 * - Realizar login/logout/registro
 * - Inicializar estado na hidratação SSR
 * 
 * Persistência:
 * - Estado é mantido apenas em memória (não persiste no localStorage)
 * - Sessão é validada via cookie HTTP-only gerenciado pelo servidor
 * - Hidratação SSR via initialize() no plugin de autenticação
 * 
 * Fluxos de erro:
 * - Erros de rede retornam { success: false, error: string }
 * - Falhas de autenticação não limpam estado (permite retry)
 * - Logout sempre limpa estado local, mesmo se API falhar
 */
export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: false,
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    userName: (state) => state.user?.name || "",
    userEmail: (state) => state.user?.email || "",
    userRoles: (state) => state.user?.roles || [],
    hasRole: (state) => (role: string) =>
      state.user?.roles.includes(role) || false,
  },

  actions: {
    /**
     * Inicializa o estado de autenticação buscando dados do usuário da API.
     * 
     * Deve ser chamado uma única vez no plugin de autenticação para:
     * - Hidratar estado SSR com sessão do servidor
     * - Validar cookie de sessão existente
     * 
     * Idempotente: chamadas subsequentes são ignoradas via flag isInitialized.
     */
    async initialize() {
      if (this.isInitialized) {
        return;
      }

      this.isLoading = true;

      try {
        const user = await $fetch<User | null>("/api/auth/me");

        if (user) {
          this.user = user;
          this.isAuthenticated = true;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.isLoading = false;
        this.isInitialized = true;
      }
    },

    /**
     * Realiza login do usuário.
     * 
     * @returns Objeto com success (boolean) e error (string) opcional
     * 
     * Side-effects:
     * - Define cookie de sessão HTTP-only no servidor
     * - Atualiza estado local com dados do usuário
     */
    async login(email: string, password: string) {
      this.isLoading = true;

      try {
        const response = await $fetch<{
          success: boolean;
          user?: User;
          error?: string;
        }>("/api/auth/login", {
          method: "POST",
          body: { email, password },
        });

        if (response.success && response.user) {
          this.user = response.user;
          this.isAuthenticated = true;
          return { success: true };
        } else {
          return { success: false, error: response.error || "Erro no login" };
        }
      } catch (error: any) {
        console.error("Erro no login:", error);
        
        // Extrair mensagem de erro do response
        let errorMessage = "Erro ao fazer login";
        
        if (error?.statusCode === 401) {
          errorMessage = error?.data?.message || error?.message || "Email ou senha inválidos";
        } else if (error?.statusCode === 400) {
          errorMessage = error?.data?.message || error?.message || "Dados inválidos";
        } else if (error?.data?.message) {
          errorMessage = error.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Realiza registro de novo usuário.
     * 
     * @returns Objeto com success (boolean) e error (string) opcional
     * 
     * Side-effects:
     * - Cria novo usuário no servidor
     * - Faz login automático após registro bem-sucedido
     * - Define cookie de sessão HTTP-only
     */
    async register(
      name: string,
      email: string,
      password: string,
      confirmPassword: string
    ) {
      this.isLoading = true;

      try {
        const response = await $fetch<{
          success: boolean;
          user?: User;
          error?: string;
        }>("/api/auth/register", {
          method: "POST",
          body: { name, email, password, confirmPassword },
        });

        if (response.success && response.user) {
          this.user = response.user;
          this.isAuthenticated = true;
          return { success: true };
        } else {
          return {
            success: false,
            error: response.error || "Erro no registro",
          };
        }
      } catch (error: any) {
        console.error("Erro no registro:", error);
        
        // Extrair mensagem de erro do response
        let errorMessage = "Erro ao criar conta";
        
        if (error?.statusCode === 400) {
          errorMessage = error?.data?.message || error?.message || "Dados inválidos";
        } else if (error?.statusCode === 409) {
          errorMessage = error?.data?.message || error?.message || "Email já cadastrado";
        } else if (error?.data?.message) {
          errorMessage = error.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Realiza logout do usuário.
     * 
     * @returns Objeto com success (boolean)
     * 
     * Side-effects:
     * - Remove cookie de sessão no servidor
     * - Limpa estado local SEMPRE, mesmo se API falhar (fail-safe)
     * 
     * Trade-off: Prioriza UX sobre consistência - usuário sempre é deslogado localmente.
     */
    async logout() {
      this.isLoading = true;

      try {
        await $fetch("/api/auth/logout", {
          method: "POST",
        });

        this.user = null;
        this.isAuthenticated = false;

        return { success: true };
      } catch (error) {
        console.error("Erro no logout:", error);
        this.user = null;
        this.isAuthenticated = false;
        return { success: false };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Atualiza os dados do usuário da API.
     * 
     * Útil para:
     * - Revalidar sessão após operações sensíveis
     * - Atualizar perfil após edição
     */
    async refreshUser() {
      try {
        const user = await $fetch<User | null>("/api/auth/me");

        if (user) {
          this.user = user;
          this.isAuthenticated = true;
        } else {
          this.user = null;
          this.isAuthenticated = false;
        }
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        this.user = null;
        this.isAuthenticated = false;
      }
    },
  },
});

