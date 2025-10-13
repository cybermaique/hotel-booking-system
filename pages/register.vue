<template>
    <div
        class="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center px-4 py-12">
        <div class="max-w-md w-full">
            <!-- Logo/Header -->
            <div class="text-center mb-8">
                <h1 data-testid="register-title" class="text-4xl font-bold text-gray-900 mb-2">
                    Criar conta
                </h1>
                <p class="text-gray-600">
                    Preencha os dados para começar
                </p>
            </div>

            <!-- Card de Registro -->
            <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <form @submit.prevent="handleRegister" class="space-y-5">
                    <!-- Nome -->
                    <AtomInput v-model="form.name" type="text" label="Nome completo" placeholder="João Silva" required
                        :error="errors.name" @blur="validateName" />

                    <!-- Email -->
                    <AtomInput v-model="form.email" type="email" label="Email" placeholder="seu@email.com" required
                        :error="errors.email" @blur="validateEmail" />

                    <!-- Password -->
                    <AtomInput v-model="form.password" type="password" label="Senha" placeholder="••••••••" required
                        :error="errors.password" @blur="validatePassword" />

                    <!-- Confirm Password -->
                    <AtomInput v-model="form.confirmPassword" type="password" label="Confirmar senha"
                        placeholder="••••••••" required :error="errors.confirmPassword"
                        @blur="validateConfirmPassword" />

                    <!-- Termos -->
                    <div class="flex items-start">
                        <div class="flex items-center h-5">
                            <input id="terms" v-model="form.acceptTerms" type="checkbox"
                                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                required />
                        </div>
                        <div class="ml-3 text-sm">
                            <label for="terms" class="text-gray-700">
                                Aceito os
                                <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                                    termos de uso
                                </a>
                                e
                                <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                                    política de privacidade
                                </a>
                            </label>
                        </div>
                    </div>

                    <!-- Botão de Registro -->
                    <AtomButton type="submit" variant="gradient" size="lg" :loading="isLoading"
                        :disabled="isLoading || !form.acceptTerms" class="w-full">
                        {{ isLoading ? 'Criando conta...' : 'Criar conta' }}
                    </AtomButton>

                    <!-- Info -->
                    <div class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p class="text-sm text-green-800">
                            ✨ Ao criar uma conta, você terá acesso a recursos exclusivos e poderá fazer reservas de
                            forma rápida e segura.
                        </p>
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
                                Já tem uma conta?
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Link para Login -->
                <div class="mt-6 text-center">
                    <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                        data-testid="go-login">
                        Fazer login
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
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
});

const errors = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
});

const isLoading = ref(false);

const validateName = () => {
    if (!form.name.trim()) {
        errors.name = 'Nome é obrigatório';
        return false;
    }

    if (form.name.trim().length < 3) {
        errors.name = 'Nome deve ter no mínimo 3 caracteres';
        return false;
    }

    errors.name = '';
    return true;
};

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

    // Re-validar confirmação se já foi preenchida
    if (form.confirmPassword) {
        validateConfirmPassword();
    }

    return true;
};

const validateConfirmPassword = () => {
    if (!form.confirmPassword) {
        errors.confirmPassword = 'Confirmação de senha é obrigatória';
        return false;
    }

    if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem';
        return false;
    }

    errors.confirmPassword = '';
    return true;
};

const handleRegister = async () => {
    // Validar todos os campos
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
        return;
    }

    if (!form.acceptTerms) {
        notifyError('Termos não aceitos', 'Você precisa aceitar os termos de uso para continuar');
        return;
    }

    isLoading.value = true;

    try {
        const result = await authStore.register(
            form.name,
            form.email,
            form.password,
            form.confirmPassword
        );

        if (result.success) {
            notifySuccess(
                'Conta criada com sucesso!',
                `Bem-vindo, ${authStore.userName}! Você já está logado.`
            );

            // Redirecionar para a página de destino ou home
            const redirect = route.query.redirect as string;
            await navigateTo(redirect || '/');
        } else {
            notifyError('Erro no registro', result.error || 'Não foi possível criar a conta');
        }
    } catch (error: any) {
        console.error('Erro no registro:', error);
        notifyError('Erro no registro', 'Ocorreu um erro ao criar a conta. Tente novamente.');
    } finally {
        isLoading.value = false;
    }
};

useHead({
    title: 'Criar Conta - Hotel Booking',
    meta: [
        { name: 'description', content: 'Crie sua conta para fazer reservas' }
    ]
});
</script>