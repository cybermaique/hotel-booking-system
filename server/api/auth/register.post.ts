import { defineEventHandler, readBody, createError, setCookie } from "h3";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  };
  error?: string;
}

// Simulação de banco de dados em memória
const registeredUsers: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  roles: string[];
}> = [];

export default defineEventHandler(async (event): Promise<RegisterResponse> => {
  const body = (await readBody(event)) as RegisterPayload;

  // Simular delay de processamento
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Validações básicas
  const errors: string[] = [];

  if (!body.name?.trim()) errors.push("Nome é obrigatório");
  if (!body.email?.trim()) errors.push("Email é obrigatório");
  if (!body.password?.trim()) errors.push("Senha é obrigatória");
  if (!body.confirmPassword?.trim())
    errors.push("Confirmação de senha é obrigatória");

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (body.email && !emailRegex.test(body.email)) {
    errors.push("Email inválido");
  }

  // Validar senha
  if (body.password && body.password.length < 6) {
    errors.push("Senha deve ter no mínimo 6 caracteres");
  }

  // Validar confirmação de senha
  if (body.password !== body.confirmPassword) {
    errors.push("As senhas não coincidem");
  }

  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation Error",
      message: errors.join(", "),
    });
  }

  // Verificar se email já está em uso
  const existingUser = registeredUsers.find((u) => u.email === body.email);
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "Conflict",
      message: "Este email já está cadastrado",
    });
  }

  // Criar novo usuário
  const newUser = {
    id: Date.now().toString(),
    name: body.name,
    email: body.email,
    password: body.password,
    roles: ["user"],
  };

  // Adicionar ao "banco de dados"
  registeredUsers.push(newUser);

  // Gerar token (mock - em produção seria JWT)
  const token = Buffer.from(
    JSON.stringify({
      userId: newUser.id,
      email: newUser.email,
      timestamp: Date.now(),
    })
  ).toString("base64");

  // Configurar cookie httpOnly
  setCookie(event, "auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });

  // Retornar dados do usuário (sem senha)
  return {
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roles: newUser.roles,
    },
  };
});
