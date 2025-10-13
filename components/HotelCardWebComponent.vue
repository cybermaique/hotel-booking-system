<template>
  <HotelCard
    v-if="parsedHotel"
    :hotel="parsedHotel"
    :show-compare-checkbox="showCompareCheckbox"
    :selected="selected"
    @view-details="handleViewDetails"
    @toggle-compare="handleToggleCompare"
  />
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import HotelCard from '~/layers/design-system/components/molecules/HotelCard.vue'
import type { Hotel } from '~/types/hotel'

// Define as propriedades que o Web Component irá receber
interface Props {
  hotel: string // Receberemos o objeto Hotel como string JSON
  showCompareCheckbox?: boolean
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCompareCheckbox: false,
  selected: false
})

const parsedHotel = ref<Hotel | null>(null)

// Função para parsear a string JSON da propriedade 'hotel'
const parseHotelProp = (hotelString: string) => {
  try {
    return JSON.parse(hotelString) as Hotel
  } catch (e) {
    console.error('Erro ao parsear a propriedade hotel:', e)
    return null
  }
}

// Inicializa o hotel
onMounted(() => {
  if (props.hotel) {
    parsedHotel.value = parseHotelProp(props.hotel)
  }
})

// Observa mudanças na propriedade 'hotel' (string)
watch(() => props.hotel, (newHotelString) => {
  parsedHotel.value = parseHotelProp(newHotelString)
}, { immediate: true })

// Manipuladores de eventos para emitir eventos CustomEvent
const instance = getCurrentInstance()

const handleViewDetails = (hotelId: string) => {
  // Emite um CustomEvent para ser capturado pelo elemento pai
  const event = new CustomEvent('view-details', { detail: hotelId, bubbles: true, composed: true })
  instance?.vnode.el?.dispatchEvent(event)
}

const handleToggleCompare = (hotelId: string, selected: boolean) => {
  // Emite um CustomEvent para ser capturado pelo elemento pai
  const event = new CustomEvent('toggle-compare', { detail: { hotelId, selected }, bubbles: true, composed: true })
  instance?.vnode.el?.dispatchEvent(event)
}
</script>

