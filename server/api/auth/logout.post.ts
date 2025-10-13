import { defineEventHandler, deleteCookie } from "h3";

interface LogoutResponse {
  success: boolean;
}

export default defineEventHandler(async (event): Promise<LogoutResponse> => {
  // Remover cookie de autenticação
  deleteCookie(event, "auth-token", {
    path: "/",
  });

  return {
    success: true,
  };
});
