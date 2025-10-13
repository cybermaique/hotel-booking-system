<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div class="overflow-x-auto" role="region" aria-label="Tabela de comparação de hotéis" tabindex="0">
      <table class="w-full">
        <thead>
          <tr class="border-b bg-gray-50">
            <th class="p-4 text-left font-semibold text-gray-900 w-48 sticky left-0 bg-gray-50 z-10">
              Características
            </th>
            <th v-for="hotel in hotels" :key="hotel.id" class="p-4 text-center min-w-64"
              :aria-label="`Informações do ${hotel.name}`">
              <div class="space-y-2">
                <NuxtLink :to="`/hotels/${hotel.id}`" class="block">
                  <img :src="hotel.images[0]" :alt="`Imagem principal do hotel ${hotel.name}`"
                    class="w-full h-32 object-cover rounded-lg" />
                </NuxtLink>

                <h3 class="font-semibold text-gray-900 text-sm">
                  <NuxtLink :to="`/hotels/${hotel.id}`" class="hover:underline">
                    {{ hotel.name }}
                  </NuxtLink>
                </h3>

                <p class="text-xs text-gray-600">{{ hotel.location }}</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b hover:bg-gray-50 focus-within:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Preço por noite</td>
            <td v-for="hotel in hotels" :key="`price-${hotel.id}`" class="p-4 text-center"
              :aria-label="`Preço: ${formatCurrency(hotel.pricePerNight)} por noite`">
              <div class="text-xl font-bold text-primary-600">
                {{ formatCurrency(hotel.pricePerNight) }}
              </div>
            </td>
          </tr>

          <tr class="border-b hover:bg-gray-50 focus-within:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Avaliação</td>
            <td v-for="hotel in hotels" :key="`rating-${hotel.id}`" class="p-4 text-center">
              <AtomRatingStars :rating="hotel.rating" :review-count="hotel.reviewCount" />
            </td>
          </tr>

          <tr class="border-b hover:bg-gray-50 focus-within:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Categoria</td>
            <td v-for="hotel in hotels" :key="`category-${hotel.id}`" class="p-4 text-center">
              <AtomBadge>{{ hotel.category }}</AtomBadge>
            </td>
          </tr>

          <tr class="border-b hover:bg-gray-50 focus-within:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Comodidades</td>
            <td v-for="hotel in hotels" :key="`amenities-${hotel.id}`" class="p-4">
              <div class="flex flex-wrap gap-1 justify-center">
                <AtomBadge v-for="amenity in hotel.amenities" :key="amenity" variant="default" size="sm">
                  {{ amenity }}
                </AtomBadge>
              </div>
            </td>
          </tr>

          <tr class="border-b hover:bg-gray-50 focus-within:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Check-in</td>
            <td v-for="hotel in hotels" :key="`checkin-${hotel.id}`" class="p-4 text-center text-sm text-gray-600">
              {{ hotel.policies.checkIn }}
            </td>
          </tr>

          <tr class="border-b hover:bg-gray-50 focus-within:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Check-out</td>
            <td v-for="hotel in hotels" :key="`checkout-${hotel.id}`" class="p-4 text-center text-sm text-gray-600">
              {{ hotel.policies.checkOut }}
            </td>
          </tr>

          <tr class="border-b hover:bg-gray-50 focus-within:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Cancelamento</td>
            <td v-for="hotel in hotels" :key="`cancellation-${hotel.id}`" class="p-4 text-center text-sm text-gray-600">
              {{ hotel.policies.cancellation }}
            </td>
          </tr>

          <tr class="border-b hover:bg-gray-50 focus-within:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Animais</td>
            <td v-for="hotel in hotels" :key="`pets-${hotel.id}`" class="p-4 text-center text-sm text-gray-600">
              <AtomBadge :variant="hotel.policies.pets ? 'success' : 'default'">
                {{ hotel.policies.pets ? 'Permitidos' : 'Não permitidos' }}
              </AtomBadge>
            </td>
          </tr>

          <tr class="hover:bg-gray-50 focus-within:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Ações</td>
            <td v-for="hotel in hotels" :key="`actions-${hotel.id}`" class="p-4 text-center">
              <AtomButton size="sm" @click="$emit('view-details', hotel.id)"
                :aria-label="`Ver detalhes do ${hotel.name}`">
                Ver Detalhes
              </AtomButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Hotel } from '~/types/hotel'

interface Props {
  hotels: Hotel[]
}

defineProps<Props>()

const emit = defineEmits<{
  'view-details': [hotelId: string]

}>()

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount)
}

// Gerenciar foco para acessibilidade
onMounted(() => {
  // Focar na tabela quando o componente for montado
  nextTick(() => {
    const table = document.querySelector('[role="region"]') as HTMLElement
    if (table) {
      table.focus()
    }
  })
})
</script>

<style scoped>
/* Melhorar a experiência de scroll horizontal */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Melhorar foco visível */
.overflow-x-auto:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
