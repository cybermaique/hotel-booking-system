import { ref, readonly } from "vue";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

const globalStore = ref<Notification[]>([]);

const isTestEnv =
  typeof process !== "undefined" &&
  typeof process.env !== "undefined" &&
  process.env.NODE_ENV === "test";

export const useNotifications = () => {
  const store = isTestEnv ? ref<Notification[]>([]) : globalStore;

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11);

    const newNotification: Notification = {
      id,
      duration: 5000,
      persistent: false,
      ...notification,
    };

    store.value.push(newNotification);

    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    const index = store.value.findIndex((n) => n.id === id);
    if (index > -1) store.value.splice(index, 1);
  };

  const clearAll = () => {
    store.value.length = 0;
  };

  const success = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      type: "success",
      title,
      message,
      ...options,
    });
  };

  const error = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      type: "error",
      title,
      message,
      persistent: options?.persistent ?? false,
      duration: options?.duration ?? 5000,
      ...options,
    });
  };

  const warning = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      type: "warning",
      title,
      message,
      ...options,
    });
  };

  const info = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      type: "info",
      title,
      message,
      ...options,
    });
  };

  const loading = (title: string, message?: string) => {
    return addNotification({
      type: "info",
      title,
      message,
      persistent: true,
    });
  };

  return {
    notifications: readonly(store),
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    loading,
  };
};

