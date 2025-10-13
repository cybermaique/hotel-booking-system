<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- repassa todos os atributos nativos: min, max, name, step, pattern, inputmode, etc -->
    <input v-bind="$attrs" :id="inputId" :type="type" :value="modelValue" :placeholder="placeholder"
      :required="required" :disabled="disabled" :aria-describedby="ariaDescribedby" :class="inputClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)" />

    <p v-if="error" class="mt-1 text-sm text-red-600" :id="`${inputId}-error`">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Importantíssimo para permitir v-bind="$attrs" no <input>
defineOptions({ inheritAttrs: false })

interface Props {
  id?: string                    // opcional: id estável vindo de fora
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel'
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  ariaDescribedby?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// usa o id passado ou gera um fallback
const inputId = computed(() =>
  props.id ?? `input-${Math.random().toString(36).slice(2, 11)}`
)

const inputClasses = computed(() => {
  const base =
    'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-colors'

  if (props.error) {
    return `${base} border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500`
  }
  if (props.disabled) {
    return `${base} border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed`
  }
  return `${base} border-gray-300 focus:ring-primary-500 focus:border-primary-500`
})

const ariaDescribedby = computed(() => {
  const ids: string[] = []
  if (props.error) ids.push(`${inputId.value}-error`)
  if (props.ariaDescribedby) ids.push(props.ariaDescribedby)
  return ids.length > 0 ? ids.join(' ') : undefined
})
</script>
