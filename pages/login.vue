<template>
    <div
        class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4 py-12">
        <div class="max-w-md w-full">
            <!-- Logo/Header -->
            <div class="text-center mb-8">
                <h1 data-testid="login-title" class="text-4xl font-bold text-gray-900 mb-2">
                    Bem-vindo de volta
                </h1>
                <p class="text-gray-600">
                    Entre na sua conta para continuar
                </p>
            </div>

            <!-- Card de Login -->
            <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <form @submit.prevent="handleLogin" class="space-y-6">
                    <!-- Email -->
                    <AtomInput v-model="form.email" type="email" label="Email" placeholder="seu@email.com" required
                        :error="errors.email" @blur="validateEmail" />

                    <!-- Password -->
                    <AtomInput v-model="form.password" type="password" label="Senha" placeholder="••••••••" required
                        :error="errors.password" @blur="validatePassword" />

                    <!-- Lembrar-me e Esqueci senha -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" v-model="form.rememberMe" type="checkbox"
                                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                                Lembrar-me
                            </label>
                        </div>

                        <div class="text-sm">
                            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                                Esqueceu a senha?
                            </a>
                        </div>
                    </div>

                    <!-- Botão de Login -->
                    <AtomButton type="submit" variant="gradient" size="lg" :loading="isLoading" :disabled="isLoading"
                        class="w-full">
                        {{ isLoading ? 'Entrando...' : 'Entrar' }}
                    </AtomButton>

                    <!-- Credenciais Demo -->
                    <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p class="text-sm text-blue-800 font-semibold mb-2">
                            🔑 Credenciais de demonstração:
                        </p>
                        <div class="text-xs text-blue-700 space-y-1">
                            <p><strong>Usuário:</strong> user@demo.com / 123456</p>
                            <p><strong>Admin:</strong> admin@demo.com / admin123</p>
                        </div>
                    </div>
                </form>

                <!-- Divider -->
                <div class="mt-6">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-gray-500">
                                Não tem uma conta?
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Link para Registro -->
                <div class="mt-6 text-center">
                    <NuxtLink to="/register" data-testid="go-register"
                        class="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                        Criar nova conta
                    </NuxtLink>
                </div>
            </div>

            <!-- Link para voltar -->
            <div class="mt-6 text-center">
                <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    ← Voltar para o início
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();
const { success: notifySuccess, error: notifyError } = useNotifications();

const form = reactive({
    email: '',
    password: '',
    rememberMe: false,
});

const errors = reactive({
    email: '',
    password: '',
});

const isLoading = ref(false);

const validateEmail = () => {
    if (!form.email) {
        errors.email = 'Email é obrigatório';
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        errors.email = 'Email inválido';
        return false;
    }

    errors.email = '';
    return true;
};

const validatePassword = () => {
    if (!form.password) {
        errors.password = 'Senha é obrigatória';
        return false;
    }

    if (form.password.length < 6) {
        errors.password = 'Senha deve ter no mínimo 6 caracteres';
        return false;
    }

    errors.password = '';
    return true;
};

const handleLogin = async () => {
    // Validar campos
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    isLoading.value = true;

    try {
        const result = await authStore.login(form.email, form.password);

        if (result.success) {
            notifySuccess('Login realizado com sucesso!', `Bem-vindo, ${authStore.userName}!`);

            // Redirecionar para a página de destino ou home
            const redirect = route.query.redirect as string;
            await navigateTo(redirect || '/');
        } else {
            notifyError('Erro no login', result.error || 'Credenciais inválidas');
        }
    } catch (error: any) {
        console.error('Erro no login:', error);
        notifyError('Erro no login', 'Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
        isLoading.value = false;
    }
};

useHead({
    title: 'Login - Hotel Booking',
    meta: [
        { name: 'description', content: 'Faça login na sua conta' }
    ]
});
</script>