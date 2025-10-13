<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="pending" class="container mx-auto px-4 py-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div class="h-64 bg-gray-200 rounded mb-6"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div class="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="container mx-auto px-4 py-8 text-center">
      <div class="text-red-500 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Hotel não encontrado</h2>
      <p class="text-gray-600 mb-4">O hotel que você está procurando não existe ou foi removido.</p>
      <AtomButton @click="navigateTo('/hotels')">Voltar para Hotéis</AtomButton>
    </div>

    <div v-else-if="hotel" class="container mx-auto px-4 py-8" data-testid="hotel-details">
      <div class="mb-6">
        <nav class="text-sm text-gray-500 mb-4">
          <NuxtLink to="/" class="hover:text-primary-600">Início</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/hotels" class="hover:text-primary-600">Hotéis</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-gray-900">{{ hotel.name }}</span>
        </nav>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ hotel.name }}</h1>
            <div class="flex items-center space-x-4">
              <AtomRatingStars :rating="hotel.rating" :review-count="hotel.reviewCount" />
              <span class="text-gray-600">{{ hotel.location }}</span>
            </div>
          </div>

          <div class="mt-4 md:mt-0 text-right">
            <div class="text-3xl font-bold text-primary-600">
              R$ {{ hotel.pricePerNight.toLocaleString('pt-BR') }}
            </div>
            <div class="text-sm text-gray-500">por noite</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <HotelImageGallery :images="hotel.images" :hotel-name="hotel.name" class="mb-6"
              data-testid="image-gallery" />

            <h2 class="text-xl font-semibold text-gray-900 mb-4">Sobre o Hotel</h2>
            <p class="text-gray-600 mb-6">{{ hotel.description }}</p>

            <h3 class="text-lg font-semibold text-gray-900 mb-3">Comodidades</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              <AtomBadge v-for="amenity in hotel.amenities" :key="amenity" variant="default">
                {{ amenity }}
              </AtomBadge>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-3">Políticas</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <p><strong>Check-in:</strong> {{ hotel.policies.checkIn }}</p>
              <p><strong>Check-out:</strong> {{ hotel.policies.checkOut }}</p>
              <p><strong>Cancelamento:</strong> {{ hotel.policies.cancellation }}</p>
              <p><strong>Animais:</strong> {{ hotel.policies.pets ? 'Permitidos' : 'Não permitidos' }}</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <OrganismBookingForm :hotel="hotel" @reserve="handleReservation" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $fetch } from 'ofetch'
import type { Hotel } from '~/types/hotel'

const route = useRoute()
const hotelId = route.params.id as string

const { data: hotel, pending, error } = await useLazyFetch<Hotel>(`/api/hotels/${hotelId}`)

const { success: notifySuccess, error: notifyError } = useNotifications()

const handleReservation = async (reservationData: any) => {
  try {
    const result = await $fetch<{ success: boolean; reservationId?: string; error?: string }>('/api/reserve', {
      method: 'POST',
      body: {
        hotelId,
        ...reservationData
      }
    })

    if (result.success) {
      // Salvar detalhes da reserva no sessionStorage
      if (process.client) {
        sessionStorage.setItem('lastReservation', JSON.stringify({
          hotelName: hotel.value?.name,
          ...reservationData
        }))
      }

      // Notificar sucesso
      notifySuccess('Reserva Confirmada!', 'Redirecionando para a página de confirmação...')

      await navigateTo(`/confirmation?reservationId=${result.reservationId}`)
    } else {
      // Notificar erro retornado pela API
      notifyError('Erro na Reserva', result.error || 'Não foi possível completar sua reserva')
    }
  } catch (error: any) {
    console.error('Erro na reserva:', error)
    notifyError('Erro na Reserva', error?.data?.message || 'Ocorreu um erro ao processar sua reserva. Tente novamente.')
  }
}

// SEO dinâmico baseado no hotel
watchEffect(() => {
  if (hotel.value) {
    useSEO({
      title: hotel.value.name,
      description: `${hotel.value.description} Reserve agora a partir de R$ ${hotel.value.pricePerNight.toLocaleString('pt-BR')} por noite. Avaliação: ${hotel.value.rating}/5 (${hotel.value.reviewCount} avaliações).`,
      keywords: ['hotel', hotel.value.name, hotel.value.location, hotel.value.category, 'reserva', 'hospedagem'],
      image: hotel.value.images[0],
      type: 'product'
    })
  }
})
</script>
