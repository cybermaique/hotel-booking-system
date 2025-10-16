<template>
  <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4" data-testid="booking-form">
    <h2 class="text-xl font-semibold text-gray-900 mb-6">Fazer Reserva</h2>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="space-y-4">
        <!-- Datas e Ocupação -->
        <div class="grid grid-cols-2 gap-4">
          <AtomInput v-model="form.checkIn" data-testid="checkin" type="date" label="Check-in" required
            :min="minCheckIn" :max="maxCheckIn" :error="errors.checkIn"
            :aria-describedby="errors.checkIn ? 'checkin-error' : undefined" @blur="handleCheckInBlur" />

          <AtomInput v-model="form.checkOut" data-testid="checkout" type="date" label="Check-out" required
            :min="minCheckOut" :error="errors.checkOut"
            :aria-describedby="errors.checkOut ? 'checkout-error' : undefined" @blur="handleCheckOutBlur" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <AtomSelect v-model="form.rooms" name="rooms" label="Quartos" :options="roomOptions" required />
          <AtomSelect v-model="form.guests" name="guests" label="Hóspedes" :options="guestOptions" required />
        </div>

        <!-- Resumo do Preço -->
        <div class="bg-gray-50 p-4 rounded-lg" data-testid="price-summary">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">{{ nights }} {{ nights === 1 ? 'noite' : 'noites' }}</span>
            <span class="text-sm text-gray-900">{{ formatCurrency(subtotal) }}</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600">Taxas e impostos</span>
            <span class="text-sm text-gray-900">{{ formatCurrency(taxes) }}</span>
          </div>
          <hr class="my-2">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-900">Total</span>
            <span class="font-bold text-xl text-primary-600">{{ formatCurrency(total) }}</span>
          </div>
        </div>

        <!-- Dados do Hóspede -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-900">Dados do Hóspede Principal</h3>

          <AtomInput v-model="form.guestName" label="Nome completo" required :error="errors.guestName"
            placeholder="Digite seu nome completo" @blur="handleNameBlur" />

          <AtomInput v-model="form.guestEmail" type="email" label="Email" required :error="errors.guestEmail"
            placeholder="seu@email.com" @blur="handleEmailBlur" />

          <AtomInput v-model="form.guestPhone" type="tel" label="Telefone" required :error="errors.guestPhone"
            placeholder="(11) 99999-9999" @input="sanitizePhone" @blur="handlePhoneBlur" />
        </div>

        <!-- Método de Pagamento -->
        <div class="space-y-4">
          <h3 class="font-medium text-gray-900">Método de Pagamento</h3>

          <AtomSelect v-model="form.paymentMethod" label="Forma de pagamento" :options="paymentOptions" required
            :error="errors.paymentMethod" />

          <div v-if="form.paymentMethod === 'credit_card'" class="space-y-4">
            <AtomInput v-model="form.cardNumber" label="Número do cartão" required :error="errors.cardNumber"
              placeholder="1234 5678 9012 3456" maxlength="19" @input="formatCardNumber" />

            <div class="grid grid-cols-2 gap-4">
              <AtomInput v-model="form.cardExpiry" label="Validade" required :error="errors.cardExpiry"
                placeholder="MM/AA" maxlength="5" @input="formatCardExpiry" />

              <AtomInput v-model="form.cardCvv" label="CVV" required :error="errors.cardCvv" placeholder="123"
                maxlength="4" />
            </div>

            <AtomInput v-model="form.cardName" label="Nome no cartão" required :error="errors.cardName"
              placeholder="Nome como impresso no cartão" />
          </div>
        </div>

        <!-- Solicitações Especiais -->
        <div>
          <label for="special-requests" class="block text-sm font-medium text-gray-700 mb-2">
            Solicitações especiais (opcional)
          </label>
          <textarea id="special-requests" v-model="form.specialRequests" rows="3"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Cama extra, andar alto, vista para o mar..."></textarea>
        </div>

        <!-- Botão de Reserva -->
        <AtomButton type="submit" size="lg" class="w-full" :loading="loading" :disabled="!isFormValid">
          <span v-if="!loading">Confirmar Reserva - {{ formatCurrency(total) }}</span>
          <span v-else>Processando...</span>
        </AtomButton>

        <p class="text-xs text-gray-500 text-center">
          Ao confirmar, você concorda com nossos termos e condições
        </p>
      </div>
    </form>

    <!-- Notificação de Status -->
    <div v-if="statusMessage" :class="statusClasses" role="status"
      :aria-live="statusMessage.type === 'error' ? 'assertive' : 'polite'" class="mt-4 p-3 rounded-md text-sm">
      {{ statusMessage.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Hotel, ReservationPayload } from '~/types/hotel'

interface Props {
  hotel: Hotel
}

const props = defineProps<Props>()

const emit = defineEmits<{
  reserve: [data: ReservationPayload]
}>()

const { validateReservationData, calculateTotalPrice, formatCurrency } = useReservation()
const { 
  getTodayString, 
  getTomorrowString, 
  addDays, 
  addYears, 
  diffInDays, 
  isTodayOrFuture, 
  isPast, 
  isAfter 
} = useDateUtils()

const loading = ref(false)
const statusMessage = ref<{ type: 'success' | 'error', text: string } | null>(null)
const { success: notifySuccess, error: notifyError, info: notifyInfo } = useNotifications()

const form = reactive({
  checkIn: '',
  checkOut: '',
  rooms: '1',
  guests: '2',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  paymentMethod: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  cardName: '',
  specialRequests: ''
})

const errors = reactive({
  checkIn: '',
  checkOut: '',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  paymentMethod: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  cardName: ''
})

const roomOptions = [
  { value: '1', label: '1 quarto' },
  { value: '2', label: '2 quartos' },
  { value: '3', label: '3 quartos' },
  { value: '4', label: '4+ quartos' }
]

const guestOptions = [
  { value: '1', label: '1 hóspede' },
  { value: '2', label: '2 hóspedes' },
  { value: '3', label: '3 hóspedes' },
  { value: '4', label: '4 hóspedes' },
  { value: '5', label: '5+ hóspedes' }
]

const paymentOptions = [
  { value: '', label: 'Selecione...' },
  { value: 'credit_card', label: 'Cartão de Crédito' },
  { value: 'debit_card', label: 'Cartão de Débito' },
  { value: 'pix', label: 'PIX' }
]

const nights = computed(() => {
  if (!form.checkIn || !form.checkOut) return 0
  const diff = diffInDays(form.checkIn, form.checkOut)
  return diff > 0 ? diff : 0
})

const subtotal = computed(() => {
  if (nights.value <= 0) return 0
  return calculateTotalPrice(props.hotel.pricePerNight, form.checkIn, form.checkOut, parseInt(form.rooms))
})

const taxes = computed(() => {
  return subtotal.value > 0 ? subtotal.value * 0.1 : 0
})

const total = computed(() => subtotal.value + taxes.value)

const isCardMethod = computed(() =>
  form.paymentMethod === 'credit_card' || form.paymentMethod === 'debit_card'
)

const isFormValid = computed(() => {
  // obrigatórios
  if (!form.checkIn || !form.checkOut) return false
  if (nights.value <= 0) return false
  if (!isValidFullName(form.guestName)) return false
  if (!isValidEmail(form.guestEmail)) return false
  if (!isValidPhoneBR(form.guestPhone)) return false
  if (!form.paymentMethod) return false

  // datas - usa dayjs para validação correta
  if (isPast(form.checkIn)) return false
  if (!isAfter(form.checkOut, form.checkIn)) return false

  // cartão (se selecionado)
  if (isCardMethod.value) {
    if (!luhnOk(form.cardNumber)) return false
    if (!isValidExpiryMMYY(form.cardExpiry)) return false
    if (!isValidCVV(form.cardCvv)) return false
    if (!isValidFullName(form.cardName)) return false
  }
  return true
})

const nameWordRe = /^[\p{L}][\p{L}''.-]*$/u // aceita letras (com acento), hífen, apóstrofo, ponto

function isValidFullName(v: string): boolean {
  if (!v) return false
  const parts = v.trim().split(/\s+/).filter(Boolean)
  if (parts.length < 2) return false            // nome + sobrenome
  if (v.replace(/\s/g, '').length < 3) return false // pelo menos 3 chars "úteis"
  return parts.every(p => nameWordRe.test(p) && p.length >= 2)
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
}

function isValidPhoneBR(v: string): boolean {
  const digits = v.replace(/\D/g, '')
  // BR: 10 (fixo) ou 11 (celular com 9)
  return digits.length === 10 || digits.length === 11
}

function luhnOk(num: string): boolean {
  const digits = num.replace(/\s/g, '')
  let sum = 0, alt = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt
  }
  return sum % 10 === 0 && digits.length >= 13 && digits.length <= 19
}

function isValidExpiryMMYY(v: string): boolean {
  const m = /^(\d{2})\/(\d{2})$/.exec(v)
  if (!m) return false
  const mm = +m[1], yy = +m[2]
  if (mm < 1 || mm > 12) return false
  const year = 2000 + yy
  const now = new Date()
  const end = new Date(year, mm, 0, 23, 59, 59) // último dia do mês
  return end >= new Date(now.getFullYear(), now.getMonth(), 1)
}

function isValidCVV(v: string): boolean {
  return /^\d{3,4}$/.test(v.trim())
}

function handleNameBlur() {
  errors.guestName = isValidFullName(form.guestName)
    ? ''
    : 'Informe seu nome completo (nome e sobrenome, apenas letras).'
}

function handleEmailBlur() {
  errors.guestEmail = isValidEmail(form.guestEmail)
    ? ''
    : 'Digite um e-mail válido (ex.: nome@dominio.com).'
}

function sanitizePhone(e: Event) {
  const el = e.target as HTMLInputElement
  form.guestPhone = el.value.replace(/[^\d ()+-]/g, '')
}

function handlePhoneBlur() {
  errors.guestPhone = isValidPhoneBR(form.guestPhone)
    ? ''
    : 'Telefone inválido. Use DDD + número (10–11 dígitos).'
}

const statusClasses = computed(() => {
  if (!statusMessage.value) return ''

  const base = 'border'
  if (statusMessage.value.type === 'success') {
    return `${base} border-green-200 bg-green-50 text-green-800`
  } else {
    return `${base} border-red-200 bg-red-50 text-red-800`
  }
})

const formatCardNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '')
  const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  form.cardNumber = formattedValue
}

const formatCardExpiry = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  form.cardExpiry = value
}

const validateForm = () => {
  // Limpar erros anteriores
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  const validationErrors = validateReservationData({
    hotelId: props.hotel.id,
    guestName: form.guestName,
    guestEmail: form.guestEmail,
    guestPhone: form.guestPhone,
    checkIn: form.checkIn,
    checkOut: form.checkOut,
    rooms: parseInt(form.rooms),
    guests: parseInt(form.guests),
    paymentMethod: form.paymentMethod as any,
    cardNumber: form.cardNumber,
    cardExpiry: form.cardExpiry,
    cardCvv: form.cardCvv,
    cardName: form.cardName
  })

  // Mapear erros para campos específicos
  validationErrors.forEach(error => {
    if (error.includes('check-in')) errors.checkIn = error
    if (error.includes('check-out')) errors.checkOut = error
    if (error.includes('Nome')) errors.guestName = error
    if (error.includes('Email')) errors.guestEmail = error
    if (error.includes('Telefone')) errors.guestPhone = error
    if (error.includes('pagamento')) errors.paymentMethod = error
    if (error.includes('cartão') && !error.includes('nome')) errors.cardNumber = error
    if (error.includes('validade')) errors.cardExpiry = error
    if (error.includes('CVV')) errors.cardCvv = error
    if (error.includes('nome no cartão')) errors.cardName = error
  })

  return validationErrors.length === 0
}

// Usa dayjs para obter datas no fuso local
const minCheckIn = computed(() => getTodayString())
const maxCheckIn = computed(() => addYears(getTodayString(), 1))
const minCheckOut = computed(() => {
  // check-out mínimo é dia seguinte ao check-in (se existir), senão amanhã
  if (!form.checkIn) {
    return getTomorrowString()
  }
  return addDays(form.checkIn, 1)
})

function handleCheckInBlur() {
  errors.checkIn = ''
  if (!form.checkIn) { 
    errors.checkIn = 'Selecione a data de check-in.'
    return
  }
  
  // Usa dayjs para validação correta no fuso local
  if (isPast(form.checkIn)) { 
    errors.checkIn = 'Check-in não pode ser no passado.'
  }

  if (form.checkOut) {
    if (!isAfter(form.checkOut, form.checkIn)) {
      errors.checkOut = 'Check-out deve ser após o check-in.'
    } else {
      errors.checkOut = ''
    }
  }
}

function handleCheckOutBlur() {
  errors.checkOut = ''
  if (!form.checkOut) { 
    errors.checkOut = 'Selecione a data de check-out.'
    return
  }
  if (!form.checkIn) { 
    errors.checkOut = 'Informe o check-in primeiro.'
    return
  }

  // Usa dayjs para validação correta no fuso local
  if (!isAfter(form.checkOut, form.checkIn)) {
    errors.checkOut = 'Check-out deve ser após o check-in.'
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    statusMessage.value = {
      type: 'error',
      text: 'Por favor, corrija os erros no formulário'
    }
    notifyError('Erro de Validação', 'Por favor, corrija os erros no formulário antes de continuar')
    return
  }

  loading.value = true
  statusMessage.value = null

  notifyInfo('Processando Reserva', 'Aguarde enquanto processamos sua reserva...')

  try {
    const reservationData: ReservationPayload = {
      hotelId: props.hotel.id,
      guestName: form.guestName,
      guestEmail: form.guestEmail,
      guestPhone: form.guestPhone,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      rooms: parseInt(form.rooms),
      guests: parseInt(form.guests),
      paymentMethod: form.paymentMethod as any,
      cardNumber: form.cardNumber,
      cardExpiry: form.cardExpiry,
      cardCvv: form.cardCvv,
      cardName: form.cardName,
      specialRequests: form.specialRequests
    }

    emit('reserve', reservationData)
  } catch (error) {
    statusMessage.value = {
      type: 'error',
      text: 'Erro ao processar reserva. Tente novamente.'
    }
    notifyError('Erro na Reserva', 'Não foi possível processar sua reserva. Por favor, tente novamente.')
  } finally {
    loading.value = false
  }
}

watch(() => form.checkIn, () => {
  if (errors.checkIn) handleCheckInBlur()
  if (form.checkOut) handleCheckOutBlur()
})

watch(() => form.checkOut, () => {
  if (errors.checkOut) handleCheckOutBlur()
})

onMounted(() => {
  // Usa dayjs para inicializar datas padrão
  form.checkIn = getTomorrowString()
  form.checkOut = addDays(getTomorrowString(), 1)
})
</script>

