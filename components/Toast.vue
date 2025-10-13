<template>
    <Teleport to="body">
        <div class="fixed top-4 right-4 z-[99999] space-y-2 max-w-sm w-full pointer-events-none">
            <TransitionGroup name="toast">
                <div v-for="notification in notifications" :key="notification.id"
                    :class="toastClasses(notification.type)" class="pointer-events-auto">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <component :is="getIcon(notification.type)" class="w-5 h-5" />
                        </div>

                        <div class="ml-3 flex-1">
                            <p class="text-sm font-semibold">{{ notification.title }}</p>
                            <p v-if="notification.message" class="mt-1 text-sm opacity-90">
                                {{ notification.message }}
                            </p>
                        </div>

                        <button @click="removeNotification(notification.id)"
                            class="ml-4 flex-shrink-0 inline-flex text-current opacity-70 hover:opacity-100 transition-opacity">
                            <span class="sr-only">Fechar</span>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div v-if="!notification.persistent && notification.duration"
                        class="mt-2 h-1 bg-current opacity-30 rounded-full overflow-hidden">
                        <div class="h-full bg-current opacity-50 animate-progress"
                            :style="{ animationDuration: `${notification.duration}ms` }" />
                    </div>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
const { notifications, removeNotification } = useNotifications();

const toastClasses = (type: string) => {
    const base = 'rounded-lg shadow-lg p-4 backdrop-blur-sm border transition-all duration-300';
    const variants = {
        success: 'bg-green-50/95 text-green-800 border-green-200',
        error: 'bg-red-50/95 text-red-800 border-red-200',
        warning: 'bg-yellow-50/95 text-yellow-800 border-yellow-200',
        info: 'bg-blue-50/95 text-blue-800 border-blue-200',
    };
    return `${base} ${variants[type as keyof typeof variants] || variants.info}`;
};

const getIcon = (type: string) => {
    const icons = {
        success: {
            template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>` },
        error: {
            template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>` },
        warning: {
            template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>` },
        info: {
            template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>` },
    };
    return icons[type as keyof typeof icons] || icons.info;
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
}

@keyframes progress {
    from {
        width: 100%;
    }

    to {
        width: 0%;
    }
}

.animate-progress {
    animation: progress linear forwards;
}
</style>