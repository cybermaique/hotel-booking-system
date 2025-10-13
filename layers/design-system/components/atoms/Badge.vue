<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center font-medium rounded-full';

  const variants: Record<NonNullable<Props['variant']>, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',

    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    outline: 'border border-gray-300 text-gray-700 bg-transparent'
  };

  const sizes: Record<NonNullable<Props['size']>, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  };

  return `${base} ${variants[props.variant!]} ${sizes[props.size!]}`;
});
</script>
