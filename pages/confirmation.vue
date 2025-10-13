<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Cabeçalho de Sucesso -->
        <div class="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Reserva Confirmada!</h1>
          <p class="text-gray-600 mb-6">
            Sua reserva foi processada com sucesso. Você receberá um email de confirmação em breve.
          </p>
          
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <p class="text-sm text-gray-600 mb-1">Código da Reserva</p>
            <p class="text-2xl font-mono font-bold text-primary-600">{{ reservationId }}</p>
          </div>
          
          <p class="text-sm text-gray-500">
            Guarde este código para consultar sua reserva posteriormente.
          </p>
        </div>
        
        <!-- Detalhes da Reserva -->
        <div v-if="reservationDetails" class="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Detalhes da Reserva</h2>
          
          <div class="space-y-4">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Hotel</span>
              <span class="font-medium text-gray-900">{{ reservationDetails.hotelName }}</span>
            </div>
            
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Hóspede</span>
              <span class="font-medium text-gray-900">{{ reservationDetails.guestName }}</span>
            </div>
            
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Email</span>
              <span class="font-medium text-gray-900">{{ reservationDetails.guestEmail }}</span>
            </div>
            
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Check-in</span>
              <span class="font-medium text-gray-900">{{ formatDate(reservationDetails.checkIn) }}</span>
            </div>
            
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Check-out</span>
              <span class="font-medium text-gray-900">{{ formatDate(reservationDetails.checkOut) }}</span>
            </div>
            
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Quartos</span>
              <span class="font-medium text-gray-900">{{ reservationDetails.rooms }}</span>
            </div>
            
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-600">Hóspedes</span>
              <span class="font-medium text-gray-900">{{ reservationDetails.guests }}</span>
            </div>
            
            <div class="flex justify-between py-3">
              <span class="text-gray-600">Método de Pagamento</span>
              <span class="font-medium text-gray-900">{{ formatPaymentMethod(reservationDetails.paymentMethod) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Próximos Passos -->
        <div class="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Próximos Passos</h2>
          
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-600 font-semibold">1</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Confirmação por Email</h3>
                <p class="text-sm text-gray-600">Você receberá um email com todos os detalhes da sua reserva.</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-600 font-semibold">2</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Prepare sua Viagem</h3>
                <p class="text-sm text-gray-600">Revise as políticas do hotel e prepare seus documentos.</p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-primary-600 font-semibold">3</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Check-in no Hotel</h3>
                <p class="text-sm text-gray-600">Apresente seu código de reserva na recepção do hotel.</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Ações -->
        <div class="flex flex-col sm:flex-row gap-4">
          <AtomButton @click="navigateTo('/hotels')" variant="outline" size="lg" class="flex-1">
            Buscar Mais Hotéis
          </AtomButton>
          <AtomButton @click="navigateTo('/')" size="lg" class="flex-1">
            Voltar ao Início
          </AtomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const reservationId = computed(() => route.query.reservationId as string || 'N/A')

// Recuperar detalhes da reserva do sessionStorage (se disponível)
const reservationDetails = ref<any>(null)

onMounted(() => {
  if (process.client) {
    const stored = sessionStorage.getItem('lastReservation')
    if (stored) {
      try {
        reservationDetails.value = JSON.parse(stored)
      } catch (e) {
        console.error('Erro ao recuperar detalhes da reserva:', e)
      }
    }
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatPaymentMethod = (method: string) => {
  const methods: Record<string, string> = {
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    pix: 'PIX'
  }
  return methods[method] || method
}

useHead({
  title: 'Reserva Confirmada - Hotel Booking',
  meta: [
    { name: 'description', content: 'Sua reserva foi confirmada com sucesso!' }
  ]
})
</script>

