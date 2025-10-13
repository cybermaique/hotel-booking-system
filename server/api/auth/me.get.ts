import { defineEventHandler, getCookie, createError } from "h3";

interface UserResponse {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

// Mock de usuários (deve ser o mesmo do login)
const MOCK_USERS = [
  {
    id: "1",
    name: "Usuário Demo",
    email: "user@demo.com",
    password: "123456",
    roles: ["user"],
  },
  {
    id: "2",
    name: "Admin Demo",
    email: "admin@demo.com",
    password: "admin123",
    roles: ["user", "admin"],
  },
];

export default defineEventHandler(
  async (event): Promise<UserResponse | null> => {
    // Obter token do cookie
    const token = getCookie(event, "auth-token");

    if (!token) {
      return null;
    }

    try {
      // Decodificar token (mock - em produção seria verificação JWT)
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());

      // Verificar se token não expirou (7 dias)
      const tokenAge = Date.now() - decoded.timestamp;
      const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 dias em ms

      if (tokenAge > maxAge) {
        return null;
      }

      // Buscar usuário
      const user = MOCK_USERS.find((u) => u.id === decoded.userId);

      if (!user) {
        return null;
      }

      // Retornar dados do usuário (sem senha)
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      };
    } catch (error) {
      // Token inválido
      return null;
    }
  }
);
