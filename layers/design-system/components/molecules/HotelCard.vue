<template>
  <div ref="cardEl"
    class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft hover:shadow-medium overflow-hidden transition-all duration-300 border border-white/50 hover:border-primary-200">
    <div class="relative overflow-hidden">
      <!-- Image Gallery -->
      <div class="relative h-64 md:h-48 lg:h-56">
        <img :src="currentImage" :alt="`Imagem do hotel ${hotel.name}`"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />

        <!-- Image Navigation -->
        <div v-if="hotel.images.length > 1" class="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          <button v-for="(image, index) in hotel.images.slice(0, 4)" :key="index" type="button"
            @click="currentImageIndex = index" :class="[
              'w-2 h-2 rounded-full transition-all duration-200',
              currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
            ]" :aria-label="`Ir para imagem ${index + 1}`" />
        </div>

        <!-- Overlay Gradient -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        </div>
      </div>

      <!-- Badges -->
      <div class="absolute top-4 right-4">
        <AtomBadge :variant="hotel.featured ? 'primary' : 'secondary'" class="backdrop-blur-sm bg-white/90 shadow-soft">
          {{ hotel.featured ? 'Destaque' : hotel.category }}
        </AtomBadge>
      </div>

      <!-- Compare Checkbox -->
      <div v-if="showCompareCheckbox" class="absolute top-4 left-4">
        <label class="flex items-center cursor-pointer group/checkbox">
          <input type="checkbox" data-testid="compare-checkbox" name="compare" class="sr-only" :checked="isSelected"
            @change="handleToggleCompare" :disabled="!isSelected && limitReached"
            :aria-disabled="(!isSelected && limitReached) ? 'true' : 'false'"
            aria-label="Selecionar hotel para comparar" />
          <div :class="[
            'w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center backdrop-blur-sm',
            isSelected
              ? 'bg-primary-500 border-primary-500 shadow-glow'
              : (!isSelected && limitReached)
                ? 'bg-white/50 border-white/50 opacity-60 cursor-not-allowed'
                : 'bg-white/80 border-white/60 hover:border-primary-300 group-hover/checkbox:scale-110'
          ]" title="Selecione até 3 hotéis">
            <svg v-if="isSelected" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </label>
      </div>

      <!-- Favorite Button -->
      <button type="button"
        class="absolute bottom-4 right-8 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:bg-white hover:scale-110 transition-all duration-200 group/heart"
        aria-label="Favoritar hotel">
        <svg class="w-5 h-5 text-gray-600 group-hover/heart:text-red-500 transition-colors" fill="none"
          stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    </div>

    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1 min-w-0">
          <h3
            class="text-xl font-display font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {{ hotel.name }}
          </h3>
          <div class="flex items-center gap-2 mt-1">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p class="text-sm text-gray-600 truncate">{{ hotel.location }}</p>
          </div>
        </div>

        <div class="flex items-center gap-1 ml-4">
          <AtomRatingStars :rating="hotel.rating" :show-rating="false" size="sm" />
          <span class="text-sm font-semibold text-gray-700 ml-1">{{ hotel.rating }}</span>
        </div>
      </div>

      <!-- Amenities -->
      <div class="flex flex-wrap gap-2 mb-4">
        <AtomBadge v-for="amenity in hotel.amenities.slice(0, 3)" :key="amenity" variant="outline" size="sm"
          class="bg-gray-50/80 hover:bg-primary-50 transition-colors">
          {{ amenity }}
        </AtomBadge>
        <AtomBadge v-if="hotel.amenities.length > 3" variant="outline" size="sm" class="bg-gray-50/80 text-gray-500">
          +{{ hotel.amenities.length - 3 }}
        </AtomBadge>
      </div>

      <!-- Price and Action -->
      <div class="flex items-center justify-between">
        <div>
          <strong class="text-2xl font-bold text-gray-900">R$ {{ hotel.pricePerNight.toLocaleString('pt-BR') }}</strong>
          <span class="ml-1 text-sm text-gray-500">/noite</span>
          <p class="text-xs text-gray-500 mt-1">Impostos inclusos</p>
        </div>

        <AtomButton variant="gradient" size="sm" rounded @click="$emit('view-details', hotel.id)">
          Ver Detalhes
        </AtomButton>
      </div>

      <!-- Quick Info -->
      <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <div class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Check-in 14h</span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
            </svg>
            <span>Cancelamento grátis</span>
          </div>
        </div>

        <div class="text-xs text-gray-500">
          {{ hotel.reviewCount || 0 }} avaliações
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Hotel } from '~/types/hotel'

interface Props {
  hotel: Hotel
  showCompareCheckbox?: boolean
  selected?: boolean            // controlado pelo pai
  limitReached?: boolean        // NOVO: pai informa se bateu no limite
}

const props = withDefaults(defineProps<Props>(), {
  showCompareCheckbox: false,
  selected: false,
  limitReached: false
})

const emit = defineEmits<{
  'view-details': [hotelId: string]
  'toggle-compare': [hotelId: string, selected: boolean]
}>()

// ---- estado derivado (controlado) ----
const isSelected = computed(() => props.selected)

// ---- imagens ----
const currentImageIndex = ref(0)
const currentImage = computed(() => props.hotel.images[currentImageIndex.value] || props.hotel.images[0])

// checkbox: não altera estado local antes do pai confirmar
const handleToggleCompare = (event: Event) => {
  const target = event.target as HTMLInputElement
  const wantSelect = target.checked
  emit('toggle-compare', props.hotel.id, wantSelect)
}

// auto-rotate por card (usando ref p/ não conflitar)
const cardEl = ref<HTMLElement | null>(null)
let imageRotationInterval: number | null = null

const startImageRotation = () => {
  if (!props.hotel?.images || props.hotel.images.length <= 1) return
  stopImageRotation()
  imageRotationInterval = window.setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % Math.min(props.hotel.images.length, 4)
  }, 2000)
}

const stopImageRotation = () => {
  if (imageRotationInterval !== null) {
    clearInterval(imageRotationInterval)
    imageRotationInterval = null
  }
}

onMounted(() => {
  if (!cardEl.value) return
  cardEl.value.addEventListener('mouseenter', startImageRotation)
  cardEl.value.addEventListener('mouseleave', stopImageRotation)
})

onUnmounted(() => {
  stopImageRotation()
  if (!cardEl.value) return
  cardEl.value.removeEventListener('mouseenter', startImageRotation)
  cardEl.value.removeEventListener('mouseleave', stopImageRotation)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
