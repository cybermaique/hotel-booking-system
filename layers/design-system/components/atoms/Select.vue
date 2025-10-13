<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select :name="name" :id="selectId" :value="modelValue" :required="required" :disabled="disabled"
      :aria-describedby="ariaDescribedby" :class="selectClasses"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)">
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600" :id="`${selectId}-error`">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  options: Option[]
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  ariaDescribedby?: string
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const selectClasses = computed(() => {
  const base = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors'

  if (props.error) {
    return `${base} border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500`
  }

  if (props.disabled) {
    return `${base} border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed`
  }

  return `${base} border-gray-300 focus:ring-primary-500 focus:border-primary-500`
})

const ariaDescribedby = computed(() => {
  const ids = []
  if (props.error) ids.push(`${selectId.value}-error`)
  if (props.ariaDescribedby) ids.push(props.ariaDescribedby)
  return ids.length > 0 ? ids.join(' ') : undefined
})
</script>
