<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Comparar Hotéis</h1>
        <p class="text-gray-600">Compare lado a lado as características dos hotéis selecionados</p>
      </div>

      <div v-if="pending" class="animate-pulse">
        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded-lg shadow-sm">
            <thead>
              <tr class="border-b">
                <th class="p-4 text-left">
                  <div class="h-4 bg-gray-200 rounded w-24"></div>
                </th>
                <th v-for="i in 3" :key="i" class="p-4">
                  <div class="h-32 bg-gray-200 rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 8" :key="i" class="border-b">
                <td class="p-4">
                  <div class="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td v-for="j in 3" :key="j" class="p-4">
                  <div class="h-4 bg-gray-200 rounded"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="error || hotels.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Nenhum hotel para comparar</h3>
        <p class="text-gray-600 mb-4">Selecione hotéis na página de busca para compará-los aqui.</p>
        <AtomButton @click="navigateTo('/hotels')">Buscar Hotéis</AtomButton>
      </div>

      <div v-else>
        <Suspense>
          <LazyOrganismHotelComparison :hotels="hotels" @view-details="navigateTo(`/hotels/${$event}`)" />
          <template #fallback>
            <div class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Carregando comparação...</p>
            </div>
          </template>
        </Suspense>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import type { Hotel, PaginatedResponse } from '~/types/hotel'

const route = useRoute()
const hotelIds = (route.query.hotels as string)?.split(',') || []

const { data: response, pending, error } = await useLazyFetch<PaginatedResponse<Hotel>>('/api/hotels', {
  query: { ids: hotelIds.join(',') },
  default: () => ({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } })
})

const hotels = computed(() => response.value?.data ?? [])

useHead({
  title: 'Comparar Hotéis - Hotel Booking',
  meta: [{ name: 'description', content: 'Compare características, preços e comodidades dos hotéis selecionados lado a lado.' }]
})
</script>