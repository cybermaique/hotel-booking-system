<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header Section -->
    <div class="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
      <div class="container mx-auto px-4" :class="isBareHotels ? 'py-3' : 'py-6'">
        <div class="flex items-center justify-between">
          <!-- Mostrar título/subtítulo apenas quando houver parâmetros -->
          <div class="flex items-center" v-if="!isBareHotels">
            <div>
              <h1 class="text-2xl md:text-3xl font-display font-bold text-gray-900">
                Hotéis em {{ searchParams.destination }}
              </h1>
              <p class="text-gray-600 text-sm md:text-base">
                {{ formatDate(searchParams.checkIn) }} - {{ formatDate(searchParams.checkOut) }} •
                {{ searchParams.rooms }} quarto(s) • {{ searchParams.guests }} hóspede(s)
              </p>
            </div>
          </div>

          <!-- Botão comparar continua visível normalmente -->
          <div v-if="selectedHotels.length >= 2" class="hidden md:block ml-auto">
            <AtomButton variant="primary" @click="navigateToCompare"
              class="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-glow">
              Comparar ({{ selectedHotels.length }})
            </AtomButton>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:w-80 flex-shrink-0">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50 p-6 sticky top-32">
            <h3 class="font-display font-bold text-gray-900 mb-6 text-lg">Filtros</h3>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">
                  Ordenar por
                </label>
                <AtomSelect v-model="sortBy" :options="sortOptions" @update:modelValue="handleSort" class="w-full" />
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <AtomCheckbox id="price-1" :model-value="selectedPriceRanges.includes('0-150')"
                    @update:modelValue="(checked) => toggleRange('0-150', checked)" />
                  <label for="price-1" class="text-sm text-gray-600">Até R$ 150</label>
                </div>

                <div class="flex items-center gap-3">
                  <AtomCheckbox id="price-2" :model-value="selectedPriceRanges.includes('150-300')"
                    @update:modelValue="(checked) => toggleRange('150-300', checked)" />
                  <label for="price-2" class="text-sm text-gray-600">R$ 150 - R$ 300</label>
                </div>

                <div class="flex items-center gap-3">
                  <AtomCheckbox id="price-3" :model-value="selectedPriceRanges.includes('300-500')"
                    @update:modelValue="(checked) => toggleRange('300-500', checked)" />
                  <label for="price-3" class="text-sm text-gray-600">R$ 300 - R$ 500</label>
                </div>

                <div class="flex items-center gap-3">
                  <AtomCheckbox id="price-4" :model-value="selectedPriceRanges.includes('500+')"
                    @update:modelValue="(checked) => toggleRange('500+', checked)" />
                  <label for="price-4" class="text-sm text-gray-600">Acima de R$ 500</label>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-6">
                <label class="block text-sm font-semibold text-gray-700 mb-3">
                  Avaliação
                </label>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <AtomCheckbox id="rating-5" :model-value="selectedRatings.includes(5)"
                      @update:modelValue="(checked) => toggleRating(5, checked)" />
                    <label for="rating-5" class="text-sm text-gray-600 flex items-center gap-1">
                      5 estrelas
                      <div class="flex text-yellow-400">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </label>
                  </div>

                  <div class="flex items-center gap-3">
                    <AtomCheckbox id="rating-4" :model-value="selectedRatings.includes(4)"
                      @update:modelValue="(checked) => toggleRating(4, checked)" />
                    <label for="rating-4" class="text-sm text-gray-600">4+ estrelas</label>
                  </div>

                  <div class="flex items-center gap-3">
                    <AtomCheckbox id="rating-3" :model-value="selectedRatings.includes(3)"
                      @update:modelValue="(checked) => toggleRating(3, checked)" />
                    <label for="rating-3" class="text-sm text-gray-600">3+ estrelas</label>
                  </div>
                </div>
              </div>

              <div v-if="selectedHotels.length >= 2" class="border-t border-gray-200 pt-6 lg:hidden">
                <AtomButton variant="primary" @click="navigateToCompare"
                  class="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
                  Comparar ({{ selectedHotels.length }})
                </AtomButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Loading State -->
          <div v-if="pending" class="grid grid-cols-1 lg:grid-cols-2 auto-rows-fr gap-6">
            <div v-for="i in 8" :key="i"
              class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-6 animate-pulse h-full">
              <div class="space-y-4">
                <div class="w-full h-40 bg-gray-200 rounded-xl"></div>
                <div class="h-6 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                <div class="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-20">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-12 max-w-md mx-auto">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Erro ao carregar hotéis</h3>
              <p class="text-gray-600 mb-6">Ocorreu um erro ao buscar os hotéis. Tente novamente.</p>
              <AtomButton @click="refresh()" class="bg-gradient-to-r from-primary-500 to-secondary-500">
                Tentar Novamente
              </AtomButton>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredHotels.length === 0" class="text-center py-20">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft p-12 max-w-md mx-auto">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Nenhum hotel encontrado</h3>
              <p class="text-gray-600 mb-6">Não encontramos hotéis para os critérios selecionados. Tente ajustar sua
                busca.</p>
              <AtomButton @click="navigateTo('/')" class="bg-gradient-to-r from-primary-500 to-secondary-500">
                Nova Busca
              </AtomButton>
            </div>
          </div>

          <!-- Hotels List -->
          <div v-else class="space-y-6">
            <div class="flex justify-between items-center">
              <p class="text-gray-600 font-medium">
                {{ pagination?.total || 0 }} hotéis encontrados
              </p>
              <div class="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Selecione até 3 hotéis para comparar
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 auto-rows-fr gap-6">
              <div v-for="(hotel, index) in filteredHotels" :key="hotel.id" class="animate-slide-up h-full"
                :style="{ animationDelay: `${index * 0.1}s` }">
                <MoleculeHotelCard :hotel="hotel" :show-compare-checkbox="true"
                  :selected="selectedHotels.includes(hotel.id)" :limit-reached="limitReached"
                  @view-details="viewHotelDetails" @toggle-compare="toggleCompare"
                  class="h-full hover:scale-[1.02] transition-transform duration-300" />
              </div>
            </div>

            <!-- Pagination Controls -->
            <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
              <AtomButton @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
              </AtomButton>

              <div class="flex gap-2">
                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  page === currentPage
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                ]">
                  {{ page }}
                </button>
              </div>

              <AtomButton @click="goToPage(currentPage + 1)" :disabled="currentPage === pagination.totalPages"
                class="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Próxima
              </AtomButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Compare Button (Mobile) -->
    <div v-if="selectedHotels.length >= 2" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
      <AtomButton @click="navigateToCompare"
        class="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-large px-6 py-3 rounded-full animate-glow">
        Comparar ({{ selectedHotels.length }})
      </AtomButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Hotel, PaginatedResponse } from '~/types/hotel'

const route = useRoute()
const router = useRouter()
const { formatDate } = useFormatters()

const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = ref(10)

const searchParams = computed(() => ({
  destination: route.query.destination as string || '',
  checkIn: route.query.checkIn as string || '',
  checkOut: route.query.checkOut as string || '',
  rooms: route.query.rooms as string || '1',
  guests: route.query.guests as string || '2',
  priceMin: route.query.price_min ? Number(route.query.price_min) : undefined
}))

const sortBy = ref('price')
const selectedHotels = ref<string[]>([])

const sortOptions = [
  { value: 'price', label: 'Menor preço' },
  { value: 'rating', label: 'Melhor avaliação' },
  { value: 'name', label: 'Nome A-Z' },
  { value: 'distance', label: 'Mais próximo' }
]

const selectedPriceRanges = ref<string[]>([])
const selectedRatings = ref<number[]>([])

// Helpers para preço
const priceInRange = (price: number, range: string) => {
  if (!Number.isFinite(price)) return false
  if (range === '0-150') return price <= 150
  if (range === '150-300') return price > 150 && price <= 300
  if (range === '300-500') return price > 300 && price <= 500
  if (range === '500+') return price > 500
  return false
}

// Aplica filtros no array vindo da API
const filteredHotels = computed(() => {
  const list = hotels.value || []

  return list.filter((h) => {
    const price = Number((h as any).pricePerNight)
    const rating = Number((h as any).rating)

    // --- filtro de preço (OR entre ranges) ---
    const passPrice =
      selectedPriceRanges.value.length === 0
        ? (searchParams.value.priceMin ? price >= searchParams.value.priceMin : true)
        : selectedPriceRanges.value.some((r) => priceInRange(price, r))

    // --- filtro de estrelas ---
    const passRating =
      selectedRatings.value.length === 0
        ? true
        : (
          (selectedRatings.value.includes(5) && rating === 5) ||
          (selectedRatings.value.includes(4) && rating >= 4) ||
          (selectedRatings.value.includes(3) && rating >= 3)
        )

    return passPrice && passRating
  })
})

const { data: response, pending, error, refresh } = await useLazyFetch<PaginatedResponse<Hotel>>('/api/hotels', {
  query: computed(() => ({
    ...searchParams.value,
    sort: sortBy.value,
    page: currentPage.value,
    limit: itemsPerPage.value
  })),
  default: () => ({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }),
  watch: [currentPage, sortBy]
})

const hotels = computed(() => response.value?.data || [])
const pagination = computed(() => response.value?.pagination)

// Calcular páginas visíveis para paginação
const visiblePages = computed(() => {
  if (!pagination.value) return []

  const total = pagination.value.totalPages
  const current = currentPage.value
  const pages: number[] = []

  // Mostrar no máximo 5 páginas
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)

  // Ajustar se estiver no final
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const goToPage = (page: number) => {
  if (!pagination.value) return
  if (page < 1 || page > pagination.value.totalPages) return

  currentPage.value = page

  // Atualizar URL
  router.push({
    query: {
      ...route.query,
      page: page.toString()
    }
  })

  // Scroll para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSort = () => {
  currentPage.value = 1
  refresh()
}

function toggleRange(range: string, checked: boolean) {
  const arr = selectedPriceRanges.value
  const has = arr.includes(range)
  if (checked && !has) arr.push(range)
  if (!checked && has) selectedPriceRanges.value = arr.filter(r => r !== range)
}

function toggleRating(r: number, checked: boolean) {
  const arr = selectedRatings.value
  const has = arr.includes(r)
  if (checked && !has) arr.push(r)
  if (!checked && has) selectedRatings.value = arr.filter(x => x !== r)
}

const MAX_COMPARE = 3

const toast = (msg: string) => {
  // @ts-ignore
  window?.$toast?.error?.(msg) || alert(msg)
}

const limitReached = computed(() => selectedHotels.value.length >= MAX_COMPARE)

const toggleCompare = (hotelId: string, wantSelect: boolean) => {
  if (wantSelect) {
    if (selectedHotels.value.length >= MAX_COMPARE) {
      toast(`Você só pode comparar até ${MAX_COMPARE} hotéis.`)
      return
    }
    if (!selectedHotels.value.includes(hotelId)) {
      selectedHotels.value.push(hotelId)
    }
  } else {
    selectedHotels.value = selectedHotels.value.filter(id => id !== hotelId)
  }
}

const navigateToCompare = () => {
  if (selectedHotels.value.length < 2) return
  navigateTo({
    path: '/compare',
    query: { hotels: selectedHotels.value.join(',') }
  })
}

const viewHotelDetails = (hotelId: string) => {
  navigateTo(`/hotels/${hotelId}`)
}

const isBareHotels = computed(() => {
  return Object.keys(route.query || {}).length === 0
})

watch(() => route.query.page, (newPage) => {
  const page = Number(newPage) || 1
  if (page !== currentPage.value) {
    currentPage.value = page
  }
})

useHead({
  title: `Hotéis em ${searchParams.value.destination} - Hotel Booking`,
  meta: [
    { name: 'description', content: `Encontre os melhores hotéis em ${searchParams.value.destination}${searchParams.value.priceMin ? ` a partir de R$ ${searchParams.value.priceMin}` : ''}. Compare preços e avaliações.` }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap' }
  ]
})
</script>
