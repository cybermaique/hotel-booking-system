// test/components/Header.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Header from "~/components/Header.vue";
import { createPinia, setActivePinia } from "pinia";

// helper: cria um "singleton" de store e faz o mock de useAuthStore retornar SEMPRE o mesmo objeto.
// assim, dá pra mutar o store dentro do teste e o componente "vê" as mudanças.
function mockAuthStore(initial?: Partial<ReturnType<any>>) {
  const store = {
    user: null as any,
    isAuthenticated: false,
    isLoading: false,
    userName: "",
    userEmail: "",
    userRoles: [] as string[],
    hasRole: (role: string) => false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    ...initial,
  };
  (globalThis as any).useAuthStore = vi.fn(() => store);
  return store;
}

// stub global do NuxtLink já está no test/setup.ts, então não é obrigatório repetir no mount.
// se quiser um stub local, descomente abaixo:
// const NuxtLinkStub = { name: 'NuxtLink', props: ['to'], template: '<a :href="to"><slot /></a>' }

describe("Header", () => {
  let pinia: any;
  const mockNavigateTo = vi.fn();

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    // sobrescreve o navigateTo global do setup pra podermos inspecionar
    vi.stubGlobal("navigateTo", mockNavigateTo);
    mockNavigateTo.mockClear();

    // default: não autenticado
    mockAuthStore({
      user: null,
      isAuthenticated: false,
      userName: "",
      userEmail: "",
      userRoles: [],
    });
  });

  // ────────────────────────────────────────────────────────────────────────────────
  // Renderização básica
  describe("Renderização básica", () => {
    it("deve renderizar corretamente", () => {
      const wrapper = mount(Header, {
        global: { plugins: [pinia] },
      });
      expect(wrapper.find("header").exists()).toBe(true);
    });

    it("deve renderizar logo", () => {
      const wrapper = mount(Header, {
        global: { plugins: [pinia] },
      });
      expect(wrapper.text()).toContain("HotelBooking");
    });

    it("deve renderizar links de navegação", () => {
      const wrapper = mount(Header, {
        global: { plugins: [pinia] },
      });
      expect(wrapper.text()).toContain("Início");
      expect(wrapper.text()).toContain("Hotéis");
    });
  });

  // ────────────────────────────────────────────────────────────────────────────────
  // Não autenticado
  describe("Estado não autenticado", () => {
    it("deve mostrar botões de login e registro quando não autenticado", () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      expect(wrapper.text()).toContain("Entrar");
      expect(wrapper.text()).toContain("Criar conta");
    });

    it("não deve mostrar menu de usuário quando não autenticado", () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      expect(wrapper.text()).not.toContain("Sair");
    });
  });

  // ────────────────────────────────────────────────────────────────────────────────
  // Autenticado
  describe("Estado autenticado", () => {
    beforeEach(() => {
      mockAuthStore({
        user: {
          id: "1",
          name: "João Silva",
          email: "joao@example.com",
          roles: ["user"],
        },
        isAuthenticated: true,
        userName: "João Silva",
        userEmail: "joao@example.com",
        userRoles: ["user"],
        hasRole: (r: string) => r === "user",
      });
    });

    it("deve mostrar nome do usuário quando autenticado", () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      expect(wrapper.text()).toContain("João Silva");
    });

    it("deve mostrar iniciais do usuário", () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      expect(wrapper.text()).toContain("JS");
    });

    it("não deve mostrar botões de login/registro quando autenticado", () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      const links = wrapper.findAll("a");
      const loginLink = links.find((l) => l.attributes("href") === "/login");
      const registerLink = links.find(
        (l) => l.attributes("href") === "/register"
      );
      expect(loginLink).toBeUndefined();
      expect(registerLink).toBeUndefined();
    });

    it("deve abrir/fechar dropdown do usuário", async () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      const userButton = wrapper.find("button");
      await userButton.trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("Sair");

      await userButton.trigger("click");
      await wrapper.vm.$nextTick();
      const dropdownMenu = wrapper.find(".absolute.right-0.mt-2");
      expect(dropdownMenu.exists()).toBe(false);
    });

    it("deve mostrar email do usuário no dropdown", async () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      const userButton = wrapper.find("button");
      await userButton.trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("joao@example.com");
    });
  });

  // ────────────────────────────────────────────────────────────────────────────────
  // Iniciais do usuário (controlando o mesmo singleton de store)
  describe("Iniciais do usuário", () => {
    it("gera iniciais para nome completo", () => {
      const store = mockAuthStore();
      store.user = {
        id: "1",
        name: "Maria Santos",
        email: "maria@example.com",
        roles: ["user"],
      };
      store.userName = "Maria Santos"; // ⬅️ crucial
      store.isAuthenticated = true;

      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      expect(wrapper.text()).toContain("MS");
    });

    it("gera iniciais para nome simples", () => {
      const store = mockAuthStore();
      store.user = {
        id: "1",
        name: "Pedro",
        email: "pedro@example.com",
        roles: ["user"],
      };
      store.userName = "Pedro"; // ⬅️ crucial
      store.isAuthenticated = true;

      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      expect(wrapper.text()).toContain("PE");
    });

    it("mostra ? quando não há nome", () => {
      const store = mockAuthStore();
      store.user = {
        id: "1",
        name: "",
        email: "user@example.com",
        roles: ["user"],
      };
      store.userName = ""; // ⬅️ mantém vazio
      store.isAuthenticated = true;

      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      expect(wrapper.text()).toContain("?");
    });
  });

  // ────────────────────────────────────────────────────────────────────────────────
  // Logout
  describe("Logout", () => {
    it("chama logout ao clicar em Sair e fecha o menu", async () => {
      const store = mockAuthStore({
        user: {
          id: "1",
          name: "João Silva",
          email: "joao@example.com",
          roles: ["user"],
        },
        isAuthenticated: true,
      });
      const logoutSpy = vi.spyOn(store, "logout");

      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      const userButton = wrapper.find("button");
      await userButton.trigger("click");
      await wrapper.vm.$nextTick();

      const logoutButton = wrapper
        .findAll("button")
        .find((b) => b.text().includes("Sair"));
      await logoutButton?.trigger("click");
      expect(logoutSpy).toHaveBeenCalled();

      await wrapper.vm.$nextTick();
      const dropdownMenu = wrapper.find(".absolute.right-0.mt-2");
      expect(dropdownMenu.exists()).toBe(false);
    });
  });

  // ────────────────────────────────────────────────────────────────────────────────
  // Links e classes
  describe("Links de navegação", () => {
    it("tem link para a página inicial", () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      const homeLink = wrapper
        .findAll("a")
        .find((l) => l.attributes("href") === "/");
      expect(homeLink).toBeDefined();
    });

    it("tem link para a página de hotéis", () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      const hotelsLink = wrapper
        .findAll("a")
        .find((l) => l.attributes("href") === "/hotels");
      expect(hotelsLink).toBeDefined();
    });
  });

  describe("Estilos e classes", () => {
    it("usa posicionamento sticky/top-0", () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      const header = wrapper.find("header");
      expect(header.classes()).toContain("sticky");
      expect(header.classes()).toContain("top-0");
    });

    it("tem z-index alto", () => {
      const wrapper = mount(Header, { global: { plugins: [pinia] } });
      const header = wrapper.find("header");
      expect(header.classes()).toContain("z-50");
    });
  });
});
