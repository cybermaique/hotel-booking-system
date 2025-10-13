export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  typescript: { strict: true },
  ssr: true,
  routeRules: { "/hotels": { swr: true } },
  extends: ["./layers/design-system"],
  
  // Variáveis públicas para runtime
  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  },
  
  app: {
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'HotelBooking - Encontre o Hotel Perfeito',
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: 'description', content: 'Descubra e compare os melhores hotéis do Brasil. Reserve com segurança e garanta o melhor preço.' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
  },
  compatibilityDate: "2025-10-10",
  nitro: {
    preset: "node-server",
  },
  vite: {
    server: { fs: { strict: false } },
    optimizeDeps: { include: ["dayjs"] },
  },
});
