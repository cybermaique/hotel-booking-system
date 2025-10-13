import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Rotas que requerem autenticação
  const protectedRoutes = ["/hotels/[id]"];

  // Rotas de autenticação (não devem ser acessadas se já estiver logado)
  const authRoutes = ["/login", "/register"];

  // Verificar se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes("[id]")) {
      const pattern = route.replace("[id]", "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(to.path);
    }
    return to.path === route;
  });

  // Verificar se é uma rota de autenticação
  const isAuthRoute = authRoutes.includes(to.path);

  // Se é uma rota protegida e o usuário não está autenticado
  if (isProtectedRoute && !authStore.isAuthenticated) {
    // Salvar a URL de destino para redirecionar após o login
    const redirectTo = to.fullPath;

    return navigateTo({
      path: "/login",
      query: { redirect: redirectTo },
    });
  }

  // Se é uma rota de autenticação e o usuário já está autenticado
  if (isAuthRoute && authStore.isAuthenticated) {
    // Redirecionar para a página inicial ou para onde estava tentando ir
    const redirect = to.query.redirect as string;
    return navigateTo(redirect || "/");
  }
});
