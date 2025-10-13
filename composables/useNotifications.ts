interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

const notifications = ref<Notification[]>([]);

/**
 * Composable para gerenciar notificações toast da aplicação.
 *
 * Fornece funções para exibir notificações de sucesso, erro, aviso e informação.
 * Notificações são auto-removidas após a duração especificada (exceto erros e persistentes).
 *
 * @returns Objeto com lista de notificações e funções para manipulá-las
 *
 * Detalhes:
 * - Estado global compartilhado entre todas as instâncias (singleton)
 * - Erros são persistentes por padrão (fechamento manual)
 * - Outras notificações desaparecem automaticamente após 5s
 * - IDs são gerados com timestamp + random (baixa chance de colisão)
 */
export const useNotifications = () => {
  /**
   * Adiciona uma nova notificação à lista.
   */
  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 11);

    const newNotification: Notification = {
      id,
      duration: 5000,
      persistent: false,
      ...notification,
    };

    notifications.value.push(newNotification);

    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    notifications.value = [];
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
      persistent: options?.persistent ?? true,
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
    notifications: readonly(notifications),
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
