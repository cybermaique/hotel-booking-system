import type { Hotel } from "../../../types/hotel";
import { defineEventHandler, getRouterParam, createError } from "h3";

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
    location: "Ipanema, Rio de Janeiro",
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
];

export default defineEventHandler(async (event) => {
  const hotelId = getRouterParam(event, "id");

  // Simular delay de rede
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 800 + 300)
  );

  const hotel = mockHotels.find((h) => h.id === hotelId);

  if (!hotel) {
    throw createError({
      statusCode: 404,
      statusMessage: "Hotel Not Found",
      message: "Hotel não encontrado",
    });
  }

  return hotel;
});
