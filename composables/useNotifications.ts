interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

/**
 * Composable para gerenciar notificações toast da aplicação.
 *
 * Fornece funções para exibir notificações de sucesso, erro, aviso e informação.
 * Notificações são auto-removidas após a duração especificada (exceto erros e persistentes).
 *
 * @returns Objeto com lista de notificações e funções para manipulá-las
 *
 * Detalhes:
 * - Cada instância tem seu próprio estado (evita vazamento entre testes/componentes)
 * - Erros são persistentes por padrão (fechamento manual)
 * - Outras notificações desaparecem automaticamente após 5s
 * - IDs são gerados com timestamp + random (baixa chance de colisão)
 */
export const useNotifications = () => {
  // Estado reativo independente por instância
  const notifications = ref<Notification[]>([]);

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

    // Remove automaticamente se não for persistente e tiver duração
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  /**
   * Remove notificação pelo ID.
   */
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  /**
   * Remove todas as notificações.
   */
  const clearAll = () => {
    notifications.value = [];
  };

  /**
   * Exibe notificação de sucesso (auto-dismiss em 5s).
   */
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

  /**
   * Exibe notificação de erro (persistente por padrão).
   */
  const error = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      type: "error",
      title,
      message,
      persistent: options?.persistent ?? true, // Erros são persistentes por padrão
      ...options,
    });
  };

  /**
   * Exibe notificação de aviso (auto-dismiss em 5s).
   */
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

  /**
   * Exibe notificação informativa (auto-dismiss em 5s).
   */
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

  /**
   * Exibe notificação de loading persistente (manual).
   */
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
