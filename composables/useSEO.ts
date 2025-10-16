interface SEOOptions {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  keywords?: string[]
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export const useSEO = (options: SEOOptions = {}) => {
  const config = useRuntimeConfig()
  const route = useRoute()
  
  const defaults = {
    siteName: 'HotelBooking',
    baseUrl: config.public.baseUrl || 'https://hotelbooking.com',
    defaultTitle: 'HotelBooking - Encontre o Hotel Perfeito',
    defaultDescription: 'Descubra e compare os melhores hotéis do Brasil. Reserve com segurança e garanta o melhor preço para sua próxima viagem.',
    defaultImage: '/images/og-image.jpg',
    twitterHandle: '@hotelbooking'
  }

  const fullTitle = options.title 
    ? `${options.title} | ${defaults.siteName}`
    : defaults.defaultTitle

  const fullUrl = options.url || `${defaults.baseUrl}${route.path}`

  const fullImage = options.image 
    ? (options.image.startsWith('http') ? options.image : `${defaults.baseUrl}${options.image}`)
    : `${defaults.baseUrl}${defaults.defaultImage}`

  const description = options.description || defaults.defaultDescription

  const meta: any[] = [
    { name: 'description', content: description },
    { name: 'keywords', content: options.keywords?.join(', ') || 'hotéis, reservas, viagens, hospedagem, brasil' },
    
    { property: 'og:site_name', content: defaults.siteName },
    { property: 'og:type', content: options.type || 'website' },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:image', content: fullImage },
    { property: 'og:url', content: fullUrl },
    { property: 'og:locale', content: 'pt_BR' },
    
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: defaults.twitterHandle },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: fullImage },
    
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
  ]

  if (options.author) {
    meta.push({ name: 'author', content: options.author })
  }

  if (options.publishedTime) {
    meta.push({ property: 'article:published_time', content: options.publishedTime })
  }
  if (options.modifiedTime) {
    meta.push({ property: 'article:modified_time', content: options.modifiedTime })
  }

  const link: any[] = [
    { rel: 'canonical', href: fullUrl }
  ]

  useHead({
    title: fullTitle,
    meta,
    link,
    htmlAttrs: {
      lang: 'pt-BR'
    }
  })

  return {
    title: fullTitle,
    description,
    image: fullImage,
    url: fullUrl
  }
}

