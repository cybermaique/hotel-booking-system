import { vi, afterEach } from "vitest";
import { config } from "@vue/test-utils";
import {
  ref,
  reactive,
  computed,
  readonly,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import "@testing-library/jest-dom";

// ────────────────────────────────────────────────────────────────────────────────
// Expor helpers do Vue como globais (opcional, útil em testes unitários)
vi.stubGlobal("ref", ref);
vi.stubGlobal("reactive", reactive);
vi.stubGlobal("computed", computed);
vi.stubGlobal("readonly", readonly);
vi.stubGlobal("watch", watch);
vi.stubGlobal("onMounted", onMounted);
vi.stubGlobal("onUnmounted", onUnmounted);
vi.stubGlobal("nextTick", nextTick);

// ────────────────────────────────────────────────────────────────────────────────
// Nuxt navigation
vi.stubGlobal("navigateTo", vi.fn());

// ────────────────────────────────────────────────────────────────────────────────
// Mocks do ecossistema Nuxt
vi.mock("#app", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: "/",
  }),
  defineNuxtComponent: (component: any) => component,
  useNuxtApp: () => ({ $config: {} }),
}));

vi.mock("#imports", () => ({
  // mock simples de useState
  useState: <T>(key: string, init?: () => T) => (init ? init() : undefined),
}));

// ────────────────────────────────────────────────────────────────────────────────
// Pinia store/composable de Auth (forma global, já que teus componentes chamam useAuthStore())
vi.stubGlobal(
  "useAuthStore",
  vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    userName: "",
    userEmail: "",
    userRoles: [] as string[],
    hasRole: (role: string) => false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  }))
);

// Notificações globais
vi.stubGlobal(
  "useNotifications",
  vi.fn(() => ({
    notifications: ref<any[]>([]),
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    clearAll: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
  }))
);

const AtomButtonStub = {
  name: "AtomButton",
  inheritAttrs: false,
  props: {
    type: { type: String, default: "button" },
    variant: String,
    size: String,
    loading: Boolean,
    rounded: Boolean,
  },
  template: '<button v-bind="$attrs" :type="type"><slot /></button>',
};

// ────────────────────────────────────────────────────────────────────────────────
// Stubs globais do Vue Test Utils
config.global.stubs = {
  ...(config.global.stubs || {}),
  // Substitui <NuxtLink> por <a>, mantendo href
  NuxtLink: {
    name: "NuxtLink",
    props: ["to"],
    template: '<a :href="to"><slot /></a>',
  },
  AtomButton: AtomButtonStub,
};
