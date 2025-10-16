<template>
  <form @submit.prevent="handleSubmit" class="relative" data-testid="search-form">
    <!-- Background Glow Effect -->
    <div
      class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000">
    </div>

    <div class="relative bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-glass border border-white/20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
        <!-- Destination -->
        <div class="lg:col-span-2 group">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <svg class="w-4 h-4 inline mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Destino
          </label>
          <div class="relative">
            <input ref="destinationInput" v-model="searchForm.destination" type="text" data-testid="destination"
              name="destination" aria-label="Destino" placeholder="Para onde você vai?" required
              @focus="onDestinationFocus" @blur="onDestinationBlur" :class="[
                'w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400',
                'placeholder-gray-400 text-gray-900 font-medium',
                errors.destination ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 hover:border-gray-300'
              ]" />
            <div v-if="showDestinationSuggestions"
              class="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-large border border-white/50 z-10">
              <div v-for="suggestion in destinationSuggestions" :key="suggestion" @click="selectDestination(suggestion)"
                class="px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl">
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span class="text-gray-700 font-medium">{{ suggestion }}</span>
                </div>
              </div>
            </div>
          </div>
          <p v-if="errors.destination" class="mt-1 text-sm text-red-600">{{ errors.destination }}</p>
        </div>

        <!-- Check-in -->
        <div class="group">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <svg class="w-4 h-4 inline mr-2 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Check-in
          </label>
          <input v-model="searchForm.checkIn" type="date" name="checkin" aria-label="Data de check-in"
            data-testid="checkin" required :min="minDate" :class="[
              'w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm',
              'focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400',
              'text-gray-900 font-medium',
              errors.checkIn ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 hover:border-gray-300'
            ]" />
          <p v-if="errors.checkIn" class="mt-1 text-sm text-red-600">{{ errors.checkIn }}</p>
        </div>

        <!-- Check-out -->
        <div class="group">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <svg class="w-4 h-4 inline mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Check-out
          </label>
          <input v-model="searchForm.checkOut" type="date" data-testid="checkout" name="checkout"
            aria-label="Data de check-out" required :min="searchForm.checkIn || minDate" :class="[
              'w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm',
              'focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400',
              'text-gray-900 font-medium',
              errors.checkOut ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 hover:border-gray-300'
            ]" />
          <p v-if="errors.checkOut" class="mt-1 text-sm text-red-600">{{ errors.checkOut }}</p>
        </div>

        <!-- Rooms and Guests -->
        <div class="grid grid-cols-2 gap-3 items-end">
          <div class="group">
            <label
              class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap leading-none">
              <svg class="w-4 h-4 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Quartos
            </label>
            <select v-model="searchForm.rooms" data-testid="rooms" name="rooms" aria-label="Quantidade de quartos"
              required
              class="w-full h-12 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 font-medium">
              <option v-for="option in roomOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>


          <div class="group">
            <label
              class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap leading-none">
              <svg class="w-4 h-4 text-secondary-500 flex-shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Hóspedes
            </label>
            <select v-model="searchForm.guests" data-testid="guests" name="guests" aria-label="Quantidade de hóspedes"
              required
              class="w-full h-12 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 font-medium">
              <option v-for="option in guestOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Search Button -->
      <div class="mt-8 flex justify-center">
        <AtomButton type="submit" variant="gradient" size="lg" :loading="loading" data-testid="submit-search"
          class="px-12 py-4 text-lg font-bold shadow-large hover:shadow-glow" rounded>
          <svg v-if="!loading" class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {{ loading ? 'Buscando...' : 'Buscar Hotéis' }}
        </AtomButton>
      </div>

      <!-- Quick Filters -->
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button v-for="filter in quickFilters" :key="filter.label" type="button" @click="applyQuickFilter(filter)"
          class="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100/80 backdrop-blur-sm rounded-full hover:bg-primary-100 hover:text-primary-700 transition-all duration-200 hover:scale-105">
          {{ filter.label }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
interface SearchForm {
  destination: string
  checkIn: string
  checkOut: string
  rooms: string
  guests: string
}

interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  search: [params: SearchForm]
}>()

const { 
  getTodayString, 
  isTodayOrFuture, 
  isAfter, 
  getNextFriday, 
  getNextSunday, 
  getNextWeek, 
  getNextWeekEnd, 
  getNextMonth, 
  getNextMonthEnd 
} = useDateUtils()

const searchForm = reactive<SearchForm>({
  destination: '',
  checkIn: '',
  checkOut: '',
  rooms: '1',
  guests: '2'
})

const errors = reactive({
  destination: '',
  checkIn: '',
  checkOut: ''
})

const showDestinationSuggestions = ref(false)

const destinationSuggestions = [
  'Rio de Janeiro, RJ',
  'São Paulo, SP',
  'Salvador, BA',
  'Fortaleza, CE',
  'Brasília, DF',
  'Recife, PE',
  'Porto Alegre, RS',
  'Manaus, AM'
]

const roomOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4+' }
]

const guestOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5+' }
]

const quickFilters = [
  { label: 'Fim de semana', checkIn: getNextFriday(), checkOut: getNextSunday() },
  { label: 'Próxima semana', checkIn: getNextWeek(), checkOut: getNextWeekEnd() },
  { label: 'Próximo mês', checkIn: getNextMonth(), checkOut: getNextMonthEnd() }
]

// Usa dayjs para obter data atual no fuso local
const minDate = computed(() => getTodayString())

const selectDestination = (destination: string) => {
  searchForm.destination = destination
  showDestinationSuggestions.value = false
}

const applyQuickFilter = (filter: any) => {
  searchForm.checkIn = filter.checkIn
  searchForm.checkOut = filter.checkOut
}

const validateForm = (): boolean => {
  errors.destination = ''
  errors.checkIn = ''
  errors.checkOut = ''

  let isValid = true

  if (!searchForm.destination.trim()) {
    errors.destination = 'Destino é obrigatório'
    isValid = false
  }

  if (!searchForm.checkIn) {
    errors.checkIn = 'Data de check-in é obrigatória'
    isValid = false
  }

  if (!searchForm.checkOut) {
    errors.checkOut = 'Data de check-out é obrigatória'
    isValid = false
  }

  if (searchForm.checkIn && searchForm.checkOut) {
    // Usa dayjs para validação correta de datas no fuso local
    if (!isTodayOrFuture(searchForm.checkIn)) {
      errors.checkIn = 'Data de check-in deve ser hoje ou no futuro'
      isValid = false
    }

    if (!isAfter(searchForm.checkOut, searchForm.checkIn)) {
      errors.checkOut = 'Data de check-out deve ser após o check-in'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('search', { ...searchForm })
  }
}

// Show suggestions when typing destination
watch(() => searchForm.destination, (newValue) => {
  showDestinationSuggestions.value = newValue.length > 0
})

// Hide suggestions when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.group')) {
      showDestinationSuggestions.value = false
    }
  })
})

const destinationInput = ref<HTMLInputElement | null>(null)
const isDestinationFocused = ref(false)

// Foco abre sugestões (se houver texto)
const onDestinationFocus = () => {
  isDestinationFocused.value = true
  if (searchForm.destination.trim().length > 0) {
    showDestinationSuggestions.value = true
  }
}

// Blur fecha sugestões (usa pequeno delay para permitir clique nos itens)
const onDestinationBlur = () => {
  isDestinationFocused.value = false
  // se usar blur direto, um clique no item pode ser perdido; com timeout curto, o clique processa antes
  setTimeout(() => {
    showDestinationSuggestions.value = false
  }, 80)
}

</script>

