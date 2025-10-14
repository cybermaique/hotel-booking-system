import type { Hotel } from "../../types/hotel";
import { defineEventHandler, getQuery, createError } from "h3";

const mockHotels: Hotel[] = [
  {
    id: "1",
    name: "Hotel Copacabana Palace",
    location: "Copacabana, Rio de Janeiro",
    images: [
      "/images/hotel_1.jpg",
      "/images/hotel_1_2.jpg",
      "/images/hotel_1_3.jpg",
    ],
    description:
      "Luxuoso hotel à beira-mar com vista deslumbrante para a praia de Copacabana. Oferece quartos elegantes, spa completo e restaurantes premiados.",
    pricePerNight: 850,
    rating: 4.8,
    reviewCount: 1247,
    category: "Luxo",
    featured: true,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Spa",
      "Academia",
      "Restaurante",
      "Bar",
      "Estacionamento",
      "Ar-condicionado",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: false,
    },
  },
  {
    id: "2",
    name: "Pousada Vila Gale",
    location: "Ipanema, Rio de Janeiro, RJ",
    images: [
      "/images/hotel_2.jpg",
      "/images/hotel_2_2.jpg",
      "/images/hotel_2_3.jpg",
    ],
    description:
      "Pousada charmosa no coração de Ipanema, próxima às melhores praias e pontos turísticos da cidade.",
    pricePerNight: 320,
    rating: 4.2,
    reviewCount: 856,
    category: "Boutique",
    featured: false,
    amenities: ["Wi-Fi", "Café da manhã", "Ar-condicionado", "TV", "Frigobar"],
    policies: {
      checkIn: "14:00",
      checkOut: "11:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: true,
    },
  },
  {
    id: "3",
    name: "Resort Transamérica",
    location: "Comandatuba, Bahia",
    images: [
      "/images/hotel_3.jpg",
      "/images/hotel_3_2.jpg",
      "/images/hotel_3_3.jpg",
    ],
    description:
      "Resort all-inclusive em ilha paradisíaca com praias privativas, campo de golfe e atividades para toda a família.",
    pricePerNight: 1200,
    rating: 4.6,
    reviewCount: 2103,
    category: "Resort",
    featured: true,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Spa",
      "Academia",
      "Restaurante",
      "Bar",
      "Golf",
      "Kids Club",
      "All-inclusive",
    ],
    policies: {
      checkIn: "16:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 72h antes",
      pets: false,
    },
  },
  {
    id: "4",
    name: "Hotel Fasano São Paulo",
    location: "Jardins, São Paulo",
    images: [
      "/images/hotel_4.jpg",
      "/images/hotel_4_2.jpg",
      "/images/hotel_4_3.jpg",
    ],
    description:
      "Hotel de design sofisticado no coração dos Jardins, com arquitetura moderna e serviço impecável.",
    pricePerNight: 680,
    rating: 4.7,
    reviewCount: 934,
    category: "Luxo",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Spa",
      "Academia",
      "Restaurante",
      "Bar",
      "Business Center",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: true,
    },
  },
  {
    id: "5",
    name: "Pousada Maravilha",
    location: "Fernando de Noronha, PE",
    images: [
      "/images/hotel_5.jpg",
      "/images/hotel_5_2.jpg",
      "/images/hotel_5_3.jpg",
    ],
    description:
      "Pousada exclusiva em Fernando de Noronha com vista privilegiada para o mar e acesso direto às praias.",
    pricePerNight: 950,
    rating: 4.9,
    reviewCount: 567,
    category: "Boutique",
    featured: true,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Restaurante",
      "Bar",
      "Mergulho",
      "Trilhas",
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 7 dias antes",
      pets: false,
    },
  },
  {
    id: "6",
    name: "Hotel Emiliano",
    location: "Copacabana, Rio de Janeiro",
    images: [
      "/images/hotel_6.jpg",
      "/images/hotel_6_2.jpg",
      "/images/hotel_6_3.jpg",
    ],
    description:
      "Hotel contemporâneo com design minimalista e vista panorâmica para a praia de Copacabana.",
    pricePerNight: 420,
    rating: 4.3,
    reviewCount: 723,
    category: "Moderno",
    featured: false,
    amenities: ["Wi-Fi", "Piscina", "Academia", "Restaurante", "Bar", "Spa"],
    policies: {
      checkIn: "15:00",
      checkOut: "11:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: true,
    },
  },
  {
    id: "7",
    name: "Pousada Toca da Coruja",
    location: "Pipa, Rio Grande do Norte",
    images: [
      "/images/hotel_7.jpg",
      "/images/hotel_7_2.jpg",
      "/images/hotel_7_3.jpg",
    ],
    description:
      "Pousada rústica e aconchegante na praia da Pipa, com decoração artesanal e ambiente descontraído.",
    pricePerNight: 280,
    rating: 4.1,
    reviewCount: 445,
    category: "Pousada",
    featured: false,
    amenities: ["Wi-Fi", "Piscina", "Café da manhã", "Bar", "Jardim"],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: true,
    },
  },
  {
    id: "8",
    name: "Grand Hyatt São Paulo",
    location: "Vila Olímpia, São Paulo",
    images: [
      "/images/hotel_8.jpg",
      "/images/hotel_8_2.jpg",
      "/images/hotel_8_3.jpg",
    ],
    description:
      "Hotel executivo moderno com excelente localização para negócios e lazer, próximo aos principais centros comerciais.",
    pricePerNight: 540,
    rating: 4.5,
    reviewCount: 1876,
    category: "Executivo",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Spa",
      "Academia",
      "Restaurante",
      "Bar",
      "Business Center",
      "Estacionamento",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: false,
    },
  },
  {
    id: "9",
    name: "Hotel Unique",
    location: "Jardins, São Paulo",
    images: [
      "/images/hotel_1.jpg",
      "/images/hotel_1_2.jpg",
      "/images/hotel_1_3.jpg",
    ],
    description:
      "Hotel icônico com arquitetura única em forma de melancia, rooftop bar famoso e vista panorâmica da cidade.",
    pricePerNight: 780,
    rating: 4.6,
    reviewCount: 1523,
    category: "Luxo",
    featured: true,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Spa",
      "Academia",
      "Restaurante",
      "Rooftop Bar",
      "Estacionamento",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: false,
    },
  },
  {
    id: "10",
    name: "Belmond Hotel das Cataratas",
    location: "Foz do Iguaçu, PR",
    images: [
      "/images/hotel_2.jpg",
      "/images/hotel_2_2.jpg",
      "/images/hotel_2_3.jpg",
    ],
    description:
      "Único hotel dentro do Parque Nacional do Iguaçu, com acesso exclusivo às Cataratas após o horário de visitação.",
    pricePerNight: 1350,
    rating: 4.9,
    reviewCount: 2456,
    category: "Resort",
    featured: true,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Spa",
      "Academia",
      "Restaurante",
      "Bar",
      "Trilhas",
      "Observação de fauna",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 72h antes",
      pets: true,
    },
  },
  {
    id: "11",
    name: "Pousada Literária",
    location: "Paraty, RJ",
    images: [
      "/images/hotel_3.jpg",
      "/images/hotel_3_2.jpg",
      "/images/hotel_3_3.jpg",
    ],
    description:
      "Pousada boutique no centro histórico de Paraty, com decoração inspirada em escritores brasileiros e biblioteca completa.",
    pricePerNight: 520,
    rating: 4.7,
    reviewCount: 892,
    category: "Boutique",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Biblioteca",
      "Restaurante",
      "Bar",
      "Spa",
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: true,
    },
  },
  {
    id: "12",
    name: "Hotel Santa Teresa",
    location: "Santa Teresa, Rio de Janeiro",
    images: [
      "/images/hotel_4.jpg",
      "/images/hotel_4_2.jpg",
      "/images/hotel_4_3.jpg",
    ],
    description:
      "Hotel boutique em mansão colonial restaurada no charmoso bairro de Santa Teresa, com vista para a Baía de Guanabara.",
    pricePerNight: 620,
    rating: 4.6,
    reviewCount: 1034,
    category: "Boutique",
    featured: false,
    amenities: ["Wi-Fi", "Piscina", "Spa", "Restaurante", "Bar", "Jardim"],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: true,
    },
  },
  {
    id: "13",
    name: "Tivoli Mofarrej",
    location: "Jardins, São Paulo",
    images: [
      "/images/hotel_5.jpg",
      "/images/hotel_5_2.jpg",
      "/images/hotel_5_3.jpg",
    ],
    description:
      "Hotel cinco estrelas na Alameda Santos, com quartos espaçosos, spa completo e gastronomia internacional.",
    pricePerNight: 590,
    rating: 4.5,
    reviewCount: 1678,
    category: "Luxo",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Spa",
      "Academia",
      "Restaurante",
      "Bar",
      "Business Center",
      "Estacionamento",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: false,
    },
  },
  {
    id: "14",
    name: "Pousada Picinguaba",
    location: "Ubatuba, SP",
    images: [
      "/images/hotel_6.jpg",
      "/images/hotel_6_2.jpg",
      "/images/hotel_6_3.jpg",
    ],
    description:
      "Pousada ecológica em praia preservada, com trilhas para cachoeiras e mergulho em águas cristalinas.",
    pricePerNight: 380,
    rating: 4.4,
    reviewCount: 567,
    category: "Pousada",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Piscina natural",
      "Café da manhã",
      "Trilhas",
      "Mergulho",
      "Caiaque",
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: true,
    },
  },
  {
    id: "15",
    name: "Hotel Fasano Angra dos Reis",
    location: "Angra dos Reis, RJ",
    images: [
      "/images/hotel_7.jpg",
      "/images/hotel_7_2.jpg",
      "/images/hotel_7_3.jpg",
    ],
    description:
      "Resort de luxo em praia particular com marina privativa, spa e gastronomia assinada.",
    pricePerNight: 1450,
    rating: 4.8,
    reviewCount: 1289,
    category: "Resort",
    featured: true,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Spa",
      "Academia",
      "Restaurante",
      "Bar",
      "Marina",
      "Esportes náuticos",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 72h antes",
      pets: false,
    },
  },
  {
    id: "16",
    name: "Pousada do Sandi",
    location: "Paraty, RJ",
    images: [
      "/images/hotel_8.jpg",
      "/images/hotel_8_2.jpg",
      "/images/hotel_8_3.jpg",
    ],
    description:
      "Pousada colonial no coração do centro histórico de Paraty, com piscina e jardim tropical.",
    pricePerNight: 450,
    rating: 4.5,
    reviewCount: 734,
    category: "Boutique",
    featured: false,
    amenities: ["Wi-Fi", "Piscina", "Café da manhã", "Jardim", "Bar"],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: true,
    },
  },
  {
    id: "17",
    name: "Hotel Vila Galé Salvador",
    location: "Salvador, BA",
    images: [
      "/images/hotel_1.jpg",
      "/images/hotel_1_2.jpg",
      "/images/hotel_1_3.jpg",
    ],
    description:
      "Hotel à beira-mar no Rio Vermelho, com piscinas, spa e vista para o Oceano Atlântico.",
    pricePerNight: 490,
    rating: 4.3,
    reviewCount: 1456,
    category: "Resort",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Spa",
      "Academia",
      "Restaurante",
      "Bar",
      "Estacionamento",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: false,
    },
  },
  {
    id: "18",
    name: "Pousada Rancho do Peixe",
    location: "Jericoacoara, CE",
    images: [
      "/images/hotel_2.jpg",
      "/images/hotel_2_2.jpg",
      "/images/hotel_2_3.jpg",
    ],
    description:
      "Pousada pé na areia em Jericoacoara, com bangalôs rústicos e escola de kitesurf.",
    pricePerNight: 580,
    rating: 4.6,
    reviewCount: 923,
    category: "Pousada",
    featured: true,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Restaurante",
      "Bar",
      "Kitesurf",
      "Windsurf",
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: true,
    },
  },
  {
    id: "19",
    name: "Hotel Transamerica Berrini",
    location: "Berrini, São Paulo",
    images: [
      "/images/hotel_3.jpg",
      "/images/hotel_3_2.jpg",
      "/images/hotel_3_3.jpg",
    ],
    description:
      "Hotel executivo na região da Berrini, ideal para viagens de negócios com centro de convenções completo.",
    pricePerNight: 420,
    rating: 4.2,
    reviewCount: 1834,
    category: "Executivo",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Academia",
      "Restaurante",
      "Bar",
      "Business Center",
      "Estacionamento",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: false,
    },
  },
  {
    id: "20",
    name: "Pousada Etnia",
    location: "Trancoso, BA",
    images: [
      "/images/hotel_4.jpg",
      "/images/hotel_4_2.jpg",
      "/images/hotel_4_3.jpg",
    ],
    description:
      "Pousada boutique em Trancoso com bangalôs de luxo, piscina infinity e vista para o Quadrado.",
    pricePerNight: 890,
    rating: 4.7,
    reviewCount: 1123,
    category: "Boutique",
    featured: true,
    amenities: ["Wi-Fi", "Piscina", "Spa", "Restaurante", "Bar", "Praia"],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: true,
    },
  },
  {
    id: "21",
    name: "Hotel Blue Tree Premium",
    location: "Paulista, São Paulo",
    images: [
      "/images/hotel_5.jpg",
      "/images/hotel_5_2.jpg",
      "/images/hotel_5_3.jpg",
    ],
    description:
      "Hotel na Avenida Paulista com vista para o MASP, próximo ao metrô e aos principais pontos turísticos.",
    pricePerNight: 380,
    rating: 4.1,
    reviewCount: 2145,
    category: "Executivo",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Academia",
      "Restaurante",
      "Bar",
      "Business Center",
      "Estacionamento",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: false,
    },
  },
  {
    id: "22",
    name: "Pousada Jardim das Margaridas",
    location: "Gramado, RS",
    images: [
      "/images/hotel_6.jpg",
      "/images/hotel_6_2.jpg",
      "/images/hotel_6_3.jpg",
    ],
    description:
      "Pousada aconchegante em Gramado com arquitetura europeia, lareira e café colonial.",
    pricePerNight: 340,
    rating: 4.4,
    reviewCount: 876,
    category: "Pousada",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Lareira",
      "Café colonial",
      "Jardim",
      "Estacionamento",
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: true,
    },
  },
  {
    id: "23",
    name: "Hotel Bourbon Cataratas",
    location: "Foz do Iguaçu, PR",
    images: [
      "/images/hotel_7.jpg",
      "/images/hotel_7_2.jpg",
      "/images/hotel_7_3.jpg",
    ],
    description:
      "Resort completo próximo às Cataratas do Iguaçu, com parque aquático, spa e entretenimento para toda a família.",
    pricePerNight: 650,
    rating: 4.5,
    reviewCount: 3421,
    category: "Resort",
    featured: true,
    amenities: [
      "Wi-Fi",
      "Parque aquático",
      "Spa",
      "Academia",
      "Restaurante",
      "Bar",
      "Kids Club",
      "Estacionamento",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: false,
    },
  },
  {
    id: "24",
    name: "Pousada Bucaneiro",
    location: "Ilhabela, SP",
    images: [
      "/images/hotel_8.jpg",
      "/images/hotel_8_2.jpg",
      "/images/hotel_8_3.jpg",
    ],
    description:
      "Pousada à beira-mar em Ilhabela com píer privativo, piscina e vista para o canal.",
    pricePerNight: 480,
    rating: 4.3,
    reviewCount: 654,
    category: "Pousada",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Piscina",
      "Píer",
      "Café da manhã",
      "Bar",
      "Estacionamento",
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 48h antes",
      pets: true,
    },
  },
  {
    id: "25",
    name: "Hotel Intercity Porto Alegre",
    location: "Centro, Porto Alegre",
    images: [
      "/images/hotel_1.jpg",
      "/images/hotel_1_2.jpg",
      "/images/hotel_1_3.jpg",
    ],
    description:
      "Hotel moderno no centro de Porto Alegre, próximo ao Mercado Público e à orla do Guaíba.",
    pricePerNight: 290,
    rating: 4.0,
    reviewCount: 1567,
    category: "Executivo",
    featured: false,
    amenities: [
      "Wi-Fi",
      "Academia",
      "Restaurante",
      "Bar",
      "Business Center",
      "Estacionamento",
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Cancelamento gratuito até 24h antes",
      pets: false,
    },
  },
];

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // Simular erro 500 se query incluir 'error=true'
  if (query.error === "true") {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: "Erro interno do servidor",
    });
  }

  // Simular lista vazia se query incluir 'empty=true'
  if (query.empty === "true") {
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  let filteredHotels = [...mockHotels];

  // Filtrar por IDs específicos (para comparação)
  if (query.ids) {
    const ids = (query.ids as string).split(",");
    filteredHotels = filteredHotels.filter((hotel) => ids.includes(hotel.id));
  }

  // Filtrar por destino
  if (query.destination) {
    const destination = (query.destination as string).toLowerCase();
    filteredHotels = filteredHotels.filter(
      (hotel) =>
        hotel.location.toLowerCase().includes(destination) ||
        hotel.name.toLowerCase().includes(destination)
    );
  }

  // Filtrar por preço mínimo
  if (query.price_min) {
    const priceMin = Number(query.price_min as string);
    filteredHotels = filteredHotels.filter(
      (hotel) => hotel.pricePerNight >= priceMin
    );
  }

  // Ordenar resultados
  if (query.sort) {
    const sortBy = query.sort as string;
    filteredHotels.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.pricePerNight - b.pricePerNight;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }

  // Implementar paginação
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const total = filteredHotels.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

  // Simular delay de rede
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 1000 + 500)
  );

  return {
    data: paginatedHotels,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
});

