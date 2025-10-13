export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Inicializar autenticação ao carregar a aplicação
  // Isso garante que o estado seja hidratado tanto no servidor quanto no cliente
  await authStore.initialize();
});
