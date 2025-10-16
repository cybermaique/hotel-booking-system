import { defineEventHandler, deleteCookie } from "h3";

interface LogoutResponse {
  success: boolean;
}

export default defineEventHandler(async (event): Promise<LogoutResponse> => {
  deleteCookie(event, "auth-token", {
    path: "/",
  });

  return {
    success: true,
  };
});
