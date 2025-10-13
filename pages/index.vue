<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 bg-hero-gradient opacity-5"></div>
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float">
      </div>
      <div
        class="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
        style="animation-delay: 2s;"></div>
      <div
        class="absolute bottom-20 left-1/2 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
        style="animation-delay: 4s;"></div>

      <div class="relative container mx-auto px-4 py-20 lg:py-32">
        <div class="text-center max-w-5xl mx-auto">
          <div class="animate-slide-down">
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-gray-900 mb-6 leading-tight">
              Encontre o
              <span class="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Hotel Perfeito
              </span>
            </h1>
          </div>

          <div class="animate-slide-up" style="animation-delay: 0.2s;">
            <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Descubra experiências únicas e compare preços dos melhores hotéis do Brasil.
              Sua próxima aventura começa aqui.
            </p>
          </div>

          <div class="animate-scale-in" style="animation-delay: 0.4s;">
            <div class="inline-flex items-center gap-4 mb-12">
              <div class="flex items-center gap-2 text-gray-600">
                <svg class="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
                </svg>
                <span class="font-medium">Melhor preço garantido</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <svg class="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
                </svg>
                <span class="font-medium">Cancelamento grátis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="max-w-6xl mx-auto animate-slide-up" style="animation-delay: 0.6s;">
          <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-glass border border-white/20 p-8">
            <MoleculeSearchBar :loading="searchLoading" @search="handleSearch" />
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white/50 backdrop-blur-sm">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div class="text-center animate-fade-in">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div class="text-gray-600 font-medium">Hotéis Parceiros</div>
          </div>
          <div class="text-center animate-fade-in" style="animation-delay: 0.1s;">
            <div class="text-3xl md:text-4xl font-bold text-secondary-600 mb-2">500K+</div>
            <div class="text-gray-600 font-medium">Reservas Realizadas</div>
          </div>
          <div class="text-center animate-fade-in" style="animation-delay: 0.2s;">
            <div class="text-3xl md:text-4xl font-bold text-accent-600 mb-2">4.9</div>
            <div class="text-gray-600 font-medium">Avaliação Média</div>
          </div>
          <div class="text-center animate-fade-in" style="animation-delay: 0.3s;">
            <div class="text-3xl md:text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div class="text-gray-600 font-medium">Suporte</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-20 bg-gradient-to-b from-white to-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Por que escolher nossa plataforma?
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos a melhor experiência em reservas de hotéis com tecnologia de ponta e atendimento excepcional.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div class="group">
            <div
              class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:-translate-y-2">
              <div
                class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Melhor Preço Garantido</h3>
              <p class="text-gray-600 leading-relaxed">
                Compare preços de centenas de sites em tempo real e encontre as melhores ofertas.
                Se encontrar um preço menor, igualamos na hora.
              </p>
            </div>
          </div>

          <div class="group">
            <div
              class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 hover:border-secondary-200 hover:-translate-y-2">
              <div
                class="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Avaliações Verificadas</h3>
              <p class="text-gray-600 leading-relaxed">
                Leia avaliações reais de hóspedes verificados que se hospedaram nos hotéis.
                Transparência total para sua decisão.
              </p>
            </div>
          </div>

          <div class="group">
            <div
              class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 hover:border-accent-200 hover:-translate-y-2">
              <div
                class="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Reserva Segura</h3>
              <p class="text-gray-600 leading-relaxed">
                Suas informações estão protegidas com criptografia de ponta e certificação SSL.
                Pagamento 100% seguro e confiável.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Destinations -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Destinos Populares
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore os destinos mais procurados e descubra ofertas especiais para sua próxima viagem.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <button type="button" class="group cursor-pointer text-left w-full"
            @click="navigateToDestination('Rio de Janeiro', 400)">
            <div
              class="relative overflow-hidden rounded-2xl shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-2">
              <img src="/images/hotel_1.jpg" alt="Rio de Janeiro"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h3 class="text-2xl font-bold mb-2">Rio de Janeiro</h3>
                <p class="text-white/90">A partir de R$ 400/noite</p>
              </div>
            </div>
          </button>

          <div class="group cursor-pointer" @click="navigateToDestination('São Paulo', 150)">
            <div
              class="relative overflow-hidden rounded-2xl shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-2">
              <img src="/images/hotel_2.jpg" alt="São Paulo"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h3 class="text-2xl font-bold mb-2">São Paulo</h3>
                <p class="text-white/90">A partir de R$ 150/noite</p>
              </div>
            </div>
          </div>

          <div class="group cursor-pointer" @click="navigateToDestination('Salvador', 120)">
            <div
              class="relative overflow-hidden rounded-2xl shadow-medium hover:shadow-large transition-all duration-300 hover:-translate-y-2">
              <img src="/images/hotel_3.jpg" alt="Salvador"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h3 class="text-2xl font-bold mb-2">Salvador</h3>
                <p class="text-white/90">A partir de R$ 120/noite</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative container mx-auto px-4 text-center">
        <h2 class="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          Pronto para sua próxima aventura?
        </h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de viajantes que já descobriram os melhores hotéis com nossa plataforma.
        </p>
        <button @click="scrollToSearch" type="button"
          class="inline-flex items-center gap-3 bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-large">
          Começar Busca
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import MoleculeSearchBar from '~/layers/design-system/components/molecules/SearchBar.vue'

interface SearchParams {
  destination: string
  checkIn: string
  checkOut: string
  rooms: string
  guests: string
}

const searchLoading = ref(false)

const handleSearch = async (params: SearchParams) => {
  searchLoading.value = true

  try {
    await navigateTo({
      path: '/hotels',
      query: {
        destination: params.destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        rooms: params.rooms,
        guests: params.guests
      }
    })
  } finally {
    searchLoading.value = false
  }
}

const navigateToDestination = async (destination: string, priceMin: number) => {
  await navigateTo({
    path: '/hotels',
    query: {
      destination,
      price_min: priceMin
    }
  })
}

const scrollToSearch = () => {
  const searchElement = document.querySelector('.bg-white\\/80')
  if (searchElement) {
    searchElement.scrollIntoView({ behavior: 'smooth' })
  }
}

// SEO otimizado
useSEO({
  title: 'Encontre o Hotel Perfeito',
  description: 'Descubra experiências únicas e compare preços dos melhores hotéis do Brasil. Reserve com segurança, melhor preço garantido e cancelamento grátis.',
  keywords: ['hotéis', 'reservas', 'hospedagem', 'viagens', 'brasil', 'pousadas', 'resorts'],
  type: 'website'
})

// Fontes e recursos externos
useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap' }
  ]
})
</script>