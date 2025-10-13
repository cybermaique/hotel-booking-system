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
 * Notificações são auto-removidas após duração especificada (exceto erros).
 *
 * @returns Objeto com lista de notificações e funções para manipulá-las
 *
 * Side-effects:
 * - Usa setTimeout para auto-remover notificações não persistentes
 * - Mantém estado reativo global de notificações
 *
 * Trade-offs:
 * - Erros são persistentes por padrão (requerem ação do usuário para fechar)
 * - Outras notificações desaparecem automaticamente após 5s
 * - IDs gerados com timestamp + random (colisão improvável mas possível)
 */
// Estado global compartilhado entre todas as instâncias
const globalNotifications = ref<Notification[]>([]);

export const useNotifications = () => {
  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000,
      persistent: false,
      ...notification,
    };

    globalNotifications.value.push(newNotification);

    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    const index = globalNotifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      globalNotifications.value.splice(index, 1);
    }
  };

  const clearAll = () => {
    globalNotifications.value = [];
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

  /**
   * Exibe notificação de erro.
   * Por padrão é persistente - requer fechamento manual pelo usuário.
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
      persistent: options?.persistent ?? false,
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

  /**
   * Exibe notificação de loading persistente.
   * Deve ser removida manualmente quando a operação terminar.
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
    notifications: readonly(globalNotifications),
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
