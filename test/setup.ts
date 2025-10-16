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

vi.stubGlobal(
  "useDateUtils",
  vi.fn(() => ({
    getTodayString: () => new Date().toISOString().split('T')[0],
    getTomorrowString: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    },
    parseLocalDate: (dateStr: string) => new Date(dateStr + 'T00:00:00'),
    formatDate: (date: Date) => date.toISOString().split('T')[0],
    addDays: (dateStr: string, days: number) => {
      const date = new Date(dateStr + 'T00:00:00');
      date.setDate(date.getDate() + days);
      return date.toISOString().split('T')[0];
    },
    diffInDays: (startStr: string, endStr: string) => {
      const start = new Date(startStr + 'T00:00:00');
      const end = new Date(endStr + 'T00:00:00');
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    },
    isTodayOrFuture: (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    isPast: (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    isBefore: (date1Str: string, date2Str: string) => {
      const date1 = new Date(date1Str + 'T00:00:00');
      const date2 = new Date(date2Str + 'T00:00:00');
      return date1 < date2;
    },
    isAfter: (date1Str: string, date2Str: string) => {
      const date1 = new Date(date1Str + 'T00:00:00');
      const date2 = new Date(date2Str + 'T00:00:00');
      return date1 > date2;
    },
    isSame: (date1Str: string, date2Str: string) => {
      const date1 = new Date(date1Str + 'T00:00:00');
      const date2 = new Date(date2Str + 'T00:00:00');
      return date1.getTime() === date2.getTime();
    },
    getNextFriday: () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysUntilFriday = dayOfWeek === 5 ? 7 : (5 - dayOfWeek + 7) % 7 || 7;
      today.setDate(today.getDate() + daysUntilFriday);
      return today.toISOString().split('T')[0];
    },
    getNextSunday: () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysUntilFriday = dayOfWeek === 5 ? 7 : (5 - dayOfWeek + 7) % 7 || 7;
      today.setDate(today.getDate() + daysUntilFriday + 2);
      return today.toISOString().split('T')[0];
    },
    getNextWeek: () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toISOString().split('T')[0];
    },
    getNextWeekEnd: () => {
      const nextWeekEnd = new Date();
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 9);
      return nextWeekEnd.toISOString().split('T')[0];
    },
    getNextMonth: () => {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth.toISOString().split('T')[0];
    },
    getNextMonthEnd: () => {
      const nextMonthEnd = new Date();
      nextMonthEnd.setMonth(nextMonthEnd.getMonth() + 1);
      nextMonthEnd.setDate(nextMonthEnd.getDate() + 3);
      return nextMonthEnd.toISOString().split('T')[0];
    },
    addYears: (dateStr: string, years: number) => {
      const date = new Date(dateStr + 'T00:00:00');
      date.setFullYear(date.getFullYear() + years);
      return date.toISOString().split('T')[0];
    },
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
