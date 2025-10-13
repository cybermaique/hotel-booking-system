<template>
  <div class="space-y-6">
    <div v-if="loading" class="space-y-4" role="status" aria-label="Carregando hotéis">
      <div v-for="i in skeletonCount" :key="i" class="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div class="flex space-x-4">
          <div class="w-48 h-32 bg-gray-200 rounded"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-12" role="alert">
      <div class="text-red-500 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar hotéis</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <AtomButton @click="$emit('retry')">Tentar Novamente</AtomButton>
    </div>

    <div v-else-if="hotels.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhum hotel encontrado</h3>
      <p class="text-gray-600 mb-4">{{ emptyMessage }}</p>
      <AtomButton @click="$emit('new-search')">Nova Busca</AtomButton>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-gray-600" :aria-live="ariaLive">
          {{ hotels.length }} {{ hotels.length === 1 ? 'hotel encontrado' : 'hotéis encontrados' }}
        </p>
        <div v-if="showCompareButton && selectedHotels.length >= 2" class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">{{ selectedHotels.length }} selecionados</span>
          <AtomButton variant="outline" size="sm" @click="$emit('compare', selectedHotels)">
            Comparar
          </AtomButton>
        </div>
      </div>

      <div :class="gridClasses">
        <hotel-card-wc v-for="hotel in hotels" :key="hotel.id" :hotel="JSON.stringify(hotel)"
          :show-compare-checkbox="showCompareCheckbox" :selected="selectedHotels.includes(hotel.id)"
          @view-details="handleViewDetailsFromWC" @toggle-compare="handleToggleCompareFromWC" />
      </div>

      <div v-if="showLoadMore" class="text-center mt-8">
        <AtomButton variant="outline" :loading="loadingMore" @click="$emit('load-more')">
          Carregar Mais
        </AtomButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Hotel } from '~/types/hotel'

interface Props {
  hotels: Hotel[]
  loading?: boolean
  error?: string
  emptyMessage?: string
  showCompareCheckbox?: boolean
  showCompareButton?: boolean
  showLoadMore?: boolean
  loadingMore?: boolean
  skeletonCount?: number
  layout?: 'grid' | 'list'
  maxSelections?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyMessage: 'Não encontramos hotéis para os critérios selecionados. Tente ajustar sua busca.',
  showCompareCheckbox: false,
  showCompareButton: false,
  showLoadMore: false,
  loadingMore: false,
  skeletonCount: 6,
  layout: 'grid',
  maxSelections: 3
})

const emit = defineEmits<{
  'view-details': [hotelId: string]
  'toggle-compare': [hotelId: string, selected: boolean]
  'compare': [hotelIds: string[]]
  'retry': []
  'new-search': []
  'load-more': []
}>()

const selectedHotels = ref<string[]>([])

const gridClasses = computed(() => {
  if (props.layout === 'list') {
    return 'space-y-4'
  }
  return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
})

const ariaLive = computed(() => {
  return props.loading ? 'polite' : 'off'
})

const handleToggleCompare = (hotelId: string, selected: boolean) => {
  if (selected) {
    if (selectedHotels.value.length < props.maxSelections) {
      selectedHotels.value.push(hotelId)
    } else {
      // Notificar que atingiu o limite
      return
    }
  } else {
    selectedHotels.value = selectedHotels.value.filter(id => id !== hotelId)
  }

  emit('toggle-compare', hotelId, selected)
}

const handleViewDetailsFromWC = (event: CustomEvent) => {
  emit('view-details', event.detail)
}

const handleToggleCompareFromWC = (event: CustomEvent) => {
  const { hotelId, selected } = event.detail
  handleToggleCompare(hotelId, selected)
}

// Limpar seleções quando a lista de hotéis mudar
watch(() => props.hotels, () => {
  selectedHotels.value = []
}, { deep: true })
</script>
