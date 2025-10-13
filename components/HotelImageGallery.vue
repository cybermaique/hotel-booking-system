<template>
  <div class="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
    <!-- Imagem Principal -->
    <img :src="currentImage" :alt="`Imagem ${currentIndex + 1} de ${hotelName}`"
      class="w-full h-full object-cover transition-opacity duration-300" />

    <!-- Botões de Navegação -->
    <button v-if="images.length > 1" @click="prevImage"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition z-10">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>

    <button v-if="images.length > 1" @click="nextImage"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition z-10">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>

    <!-- Indicador de Imagem -->
    <div v-if="images.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <span v-for="(image, index) in images" :key="index" :class="[
        'block w-2 h-2 rounded-full transition-colors duration-300',
        currentIndex === index ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
      ]"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  images: string[]
  hotelName: string
}>()

const currentIndex = ref(0)

const currentImage = computed(() => {
  return props.images[currentIndex.value] || '/images/placeholder.png' // Fallback para placeholder
})

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}
</script>
