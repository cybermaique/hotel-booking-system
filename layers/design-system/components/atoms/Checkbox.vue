<template>
  <div class="flex items-center">
    <input
      :id="checkboxId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :aria-describedby="ariaDescribedby"
      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label v-if="label" :for="checkboxId" class="ml-2 block text-sm text-gray-900 cursor-pointer">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  disabled?: boolean
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checkboxId = computed(() => `checkbox-${Math.random().toString(36).substr(2, 9)}`)
</script>
