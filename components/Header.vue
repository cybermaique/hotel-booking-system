<template>
    <header role="banner" class="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 isolate shadow-sm">

        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center space-x-2 group" aria-label="Ir para página inicial">
                    <div
                        class="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                        aria-hidden="true">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <span class="text-xl font-bold text-gray-900">HotelBooking</span>
                </NuxtLink>

                <!-- Navigation -->
                <nav role="navigation" aria-label="Navegação principal" class="hidden md:flex items-center space-x-8">
                    <NuxtLink to="/" class="text-gray-700 hover:text-primary-600 font-medium transition-colors" aria-label="Ir para página inicial">
                        Início
                    </NuxtLink>
                    <NuxtLink to="/hotels" class="text-gray-700 hover:text-primary-600 font-medium transition-colors" aria-label="Ver lista de hotéis">
                        Hotéis
                    </NuxtLink>
                </nav>

                <!-- Auth Section -->
                <div class="flex items-center space-x-4">
                    <template v-if="authStore.isAuthenticated">
                        <!-- User Menu -->
                        <div class="relative" ref="userMenuRef">
                            <button 
                                @click="toggleUserMenu" 
                                @keydown.escape="showUserMenu = false"
                                data-testid="open-user-menu"
                                :aria-expanded="showUserMenu"
                                aria-haspopup="true"
                                aria-label="Menu do usuário"
                                class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500">
                                <div
                                    class="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                    aria-hidden="true">
                                    {{ userInitials }}
                                </div>
                                <span class="hidden md:block text-gray-700 font-medium">
                                    {{ authStore.userName }}
                                </span>
                                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <!-- Dropdown Menu -->
                            <Transition name="dropdown">
                                <div v-if="showUserMenu"
                                    role="menu"
                                    aria-label="Opções do usuário"
                                    class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    <div class="px-4 py-3 border-b border-gray-100" role="presentation">
                                        <p class="text-sm font-semibold text-gray-900">{{ authStore.userName }}</p>
                                        <p class="text-xs text-gray-500 truncate">{{ authStore.userEmail }}</p>
                                    </div>

                                    <button 
                                        @click="handleLogout" 
                                        data-testid="logout"
                                        role="menuitem"
                                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 focus:outline-none focus:bg-red-50">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sair</span>
                                    </button>
                                </div>
                            </Transition>
                        </div>
                    </template>

                    <template v-else>
                        <!-- Login/Register Buttons -->
                        <NuxtLink to="/login">
                            <AtomButton variant="ghost" size="sm" aria-label="Fazer login">
                                Entrar
                            </AtomButton>
                        </NuxtLink>
                        <NuxtLink to="/register">
                            <AtomButton variant="gradient" size="sm" aria-label="Criar nova conta">
                                Criar conta
                            </AtomButton>
                        </NuxtLink>
                    </template>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const { success: notifySuccess } = useNotifications();

const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const userInitials = computed(() => {
    const name = authStore.userName;
    if (!name) return '?';

    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
});

const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
    showUserMenu.value = false;

    await authStore.logout();
    notifySuccess('Logout realizado', 'Até logo!');

    await navigateTo('/');
};

// Fechar menu ao clicar fora
onMounted(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
            showUserMenu.value = false;
        }
    };

    document.addEventListener('click', handleClickOutside);

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s ease;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>