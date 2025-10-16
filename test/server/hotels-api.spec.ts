import { describe, it, expect } from "vitest";
import type { Hotel, PaginatedResponse } from "~/types/hotel";

// Simulação de resposta da API de hotéis
const mockApiResponse = (page: number, limit: number, total: number): PaginatedResponse<Hotel> => {
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);
  
  const hotels: Hotel[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    hotels.push({
      id: `${i + 1}`,
      name: `Hotel ${i + 1}`,
      location: "São Paulo",
      rating: 4.5,
      pricePerNight: 200 + i * 10,
      images: [`/img${i + 1}.jpg`],
      amenities: ["Wi-Fi", "Piscina"],
      category: "Luxo",
      featured: i % 2 === 0,
      reviewCount: 100 + i * 10,
      description: `Hotel description ${i + 1}`,
      policies: {
        checkIn: "14:00",
        checkOut: "12:00",
        cancellation: "Free cancellation",
        pets: true,
      },
    });
  }

  return {
    data: hotels,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

describe("Hotels API - Paginação Backend", () => {
  describe("Cálculo de paginação", () => {
    it("deve calcular corretamente o número total de páginas", () => {
      const response = mockApiResponse(1, 10, 25);
      
      expect(response.pagination.totalPages).toBe(3);
      expect(response.pagination.total).toBe(25);
    });

    it("deve retornar a primeira página com limite padrão", () => {
      const response = mockApiResponse(1, 10, 50);
      
      expect(response.data).toHaveLength(10);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(10);
      expect(response.data[0].id).toBe("1");
      expect(response.data[9].id).toBe("10");
    });

    it("deve retornar a segunda página corretamente", () => {
      const response = mockApiResponse(2, 10, 50);
      
      expect(response.data).toHaveLength(10);
      expect(response.pagination.page).toBe(2);
      expect(response.data[0].id).toBe("11");
      expect(response.data[9].id).toBe("20");
    });

    it("deve retornar a última página com menos itens", () => {
      const response = mockApiResponse(3, 10, 25);
      
      expect(response.data).toHaveLength(5);
      expect(response.pagination.page).toBe(3);
      expect(response.data[0].id).toBe("21");
      expect(response.data[4].id).toBe("25");
    });

    it("deve lidar com limite customizado", () => {
      const response = mockApiResponse(1, 5, 20);
      
      expect(response.data).toHaveLength(5);
      expect(response.pagination.limit).toBe(5);
      expect(response.pagination.totalPages).toBe(4);
    });

    it("deve lidar com página vazia quando não há mais resultados", () => {
      const response = mockApiResponse(10, 10, 25);
      
      expect(response.data).toHaveLength(0);
      expect(response.pagination.page).toBe(10);
    });
  });

  describe("Estrutura da resposta paginada", () => {
    it("deve ter a estrutura correta de PaginatedResponse", () => {
      const response = mockApiResponse(1, 10, 30);
      
      expect(response).toHaveProperty("data");
      expect(response).toHaveProperty("pagination");
      expect(Array.isArray(response.data)).toBe(true);
    });

    it("deve ter todos os campos de paginação", () => {
      const response = mockApiResponse(2, 10, 30);
      
      expect(response.pagination).toHaveProperty("page");
      expect(response.pagination).toHaveProperty("limit");
      expect(response.pagination).toHaveProperty("total");
      expect(response.pagination).toHaveProperty("totalPages");
    });

    it("deve retornar hotéis com estrutura completa", () => {
      const response = mockApiResponse(1, 5, 20);
      
      response.data.forEach((hotel) => {
        expect(hotel).toHaveProperty("id");
        expect(hotel).toHaveProperty("name");
        expect(hotel).toHaveProperty("location");
        expect(hotel).toHaveProperty("rating");
        expect(hotel).toHaveProperty("pricePerNight");
        expect(hotel).toHaveProperty("images");
        expect(hotel).toHaveProperty("amenities");
        expect(hotel).toHaveProperty("category");
        expect(hotel).toHaveProperty("featured");
        expect(hotel).toHaveProperty("reviewCount");
        expect(hotel).toHaveProperty("description");
        expect(hotel).toHaveProperty("policies");
      });
    });
  });

  describe("Casos extremos", () => {
    it("deve lidar com total de 0 itens", () => {
      const response = mockApiResponse(1, 10, 0);
      
      expect(response.data).toHaveLength(0);
      expect(response.pagination.total).toBe(0);
      expect(response.pagination.totalPages).toBe(0);
    });

    it("deve lidar com limite maior que o total", () => {
      const response = mockApiResponse(1, 100, 10);
      
      expect(response.data).toHaveLength(10);
      expect(response.pagination.totalPages).toBe(1);
    });

    it("deve calcular corretamente quando total é múltiplo exato do limite", () => {
      const response = mockApiResponse(1, 10, 30);
      
      expect(response.pagination.totalPages).toBe(3);
    });

    it("deve retornar página correta mesmo com limite de 1", () => {
      const response = mockApiResponse(5, 1, 10);
      
      expect(response.data).toHaveLength(1);
      expect(response.data[0].id).toBe("5");
      expect(response.pagination.totalPages).toBe(10);
    });
  });
});

