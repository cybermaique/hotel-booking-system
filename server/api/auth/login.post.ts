import { defineEventHandler, readBody, createError, setCookie } from "h3";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
  error?: string;
}

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

export default defineEventHandler(async (event): Promise<LoginResponse> => {
  const body = (await readBody(event)) as LoginPayload;

  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!body.email?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      message: "Email é obrigatório",
    });
  }

  if (!body.password?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      message: "Senha é obrigatória",
    });
  }

  const user = MOCK_USERS.find(
    (u) => u.email === body.email && u.password === body.password
  );

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication Error",
      message: "Email ou senha inválidos",
    });
  }

  const token = Buffer.from(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      timestamp: Date.now(),
    })
  ).toString("base64");

  setCookie(event, "auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  };
});
