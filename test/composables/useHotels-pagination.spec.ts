import { describe, it, expect, vi, beforeEach } from "vitest";
import { useHotels } from "~/composables/useHotels";
import type { Hotel, PaginatedResponse } from "~/types/hotel";

const mockFetch = vi.fn();
vi.mock("ofetch", () => ({
  $fetch: (...args: any[]) => mockFetch(...args),
}));

const createMockHotels = (count: number): Hotel[] => {
  return Array.from({ length: count }, (_, i) => ({
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
  }));
};

const createMockPaginatedResponse = (
  page: number,
  limit: number,
  total: number
): PaginatedResponse<Hotel> => {
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);
  const hotels = createMockHotels(total).slice(startIndex, endIndex);

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

describe("useHotels - Paginação Frontend", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("searchHotels com paginação", () => {
    it("deve buscar primeira página com limite padrão", async () => {
      const mockResponse = createMockPaginatedResponse(1, 10, 50);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({
        destination: "São Paulo",
        page: 1,
        limit: 10,
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/hotels", {
        query: { destination: "São Paulo", page: 1, limit: 10 },
      });
      expect(result.data).toHaveLength(10);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.total).toBe(50);
      expect(result.pagination.totalPages).toBe(5);
    });

    it("deve buscar segunda página corretamente", async () => {
      const mockResponse = createMockPaginatedResponse(2, 10, 50);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({
        destination: "São Paulo",
        page: 2,
        limit: 10,
      });

      expect(result.data).toHaveLength(10);
      expect(result.pagination.page).toBe(2);
      expect(result.data[0].id).toBe("11");
    });

    it("deve buscar última página com menos itens", async () => {
      const mockResponse = createMockPaginatedResponse(3, 10, 25);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({
        destination: "São Paulo",
        page: 3,
        limit: 10,
      });

      expect(result.data).toHaveLength(5);
      expect(result.pagination.page).toBe(3);
      expect(result.pagination.totalPages).toBe(3);
    });

    it("deve buscar com limite customizado", async () => {
      const mockResponse = createMockPaginatedResponse(1, 5, 50);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({
        destination: "São Paulo",
        page: 1,
        limit: 5,
      });

      expect(result.data).toHaveLength(5);
      expect(result.pagination.limit).toBe(5);
      expect(result.pagination.totalPages).toBe(10);
    });

    it("deve buscar sem parâmetros de paginação (usa padrão do backend)", async () => {
      const mockResponse = createMockPaginatedResponse(1, 10, 50);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({
        destination: "São Paulo",
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/hotels", {
        query: { destination: "São Paulo" },
      });
      expect(result.data).toHaveLength(10);
    });

    it("deve combinar paginação com filtros de busca", async () => {
      const mockResponse = createMockPaginatedResponse(2, 5, 30);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({
        destination: "Rio de Janeiro",
        checkIn: "2025-10-20",
        checkOut: "2025-10-25",
        rooms: 2,
        guests: 4,
        page: 2,
        limit: 5,
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/hotels", {
        query: {
          destination: "Rio de Janeiro",
          checkIn: "2025-10-20",
          checkOut: "2025-10-25",
          rooms: 2,
          guests: 4,
          page: 2,
          limit: 5,
        },
      });
      expect(result.pagination.page).toBe(2);
    });
  });

  describe("Navegação entre páginas", () => {
    it("deve permitir navegar para próxima página", async () => {
      const mockResponse1 = createMockPaginatedResponse(1, 10, 50);
      const mockResponse2 = createMockPaginatedResponse(2, 10, 50);
      
      mockFetch.mockResolvedValueOnce(mockResponse1);
      mockFetch.mockResolvedValueOnce(mockResponse2);
      
      const { searchHotels } = useHotels();
      
      const result1 = await searchHotels({ destination: "São Paulo", page: 1, limit: 10 });
      expect(result1.pagination.page).toBe(1);
      expect(result1.data[0].id).toBe("1");
      
      const result2 = await searchHotels({ destination: "São Paulo", page: 2, limit: 10 });
      expect(result2.pagination.page).toBe(2);
      expect(result2.data[0].id).toBe("11");
    });

    it("deve permitir navegar para página anterior", async () => {
      const mockResponse2 = createMockPaginatedResponse(2, 10, 50);
      const mockResponse1 = createMockPaginatedResponse(1, 10, 50);
      
      mockFetch.mockResolvedValueOnce(mockResponse2);
      mockFetch.mockResolvedValueOnce(mockResponse1);
      
      const { searchHotels } = useHotels();
      
      const result2 = await searchHotels({ destination: "São Paulo", page: 2, limit: 10 });
      expect(result2.pagination.page).toBe(2);
      
      const result1 = await searchHotels({ destination: "São Paulo", page: 1, limit: 10 });
      expect(result1.pagination.page).toBe(1);
    });

    it("deve calcular se há próxima página", async () => {
      const mockResponse = createMockPaginatedResponse(2, 10, 50);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({ destination: "São Paulo", page: 2, limit: 10 });
      
      const hasNextPage = result.pagination.page < result.pagination.totalPages;
      expect(hasNextPage).toBe(true);
    });

    it("deve calcular se há página anterior", async () => {
      const mockResponse = createMockPaginatedResponse(2, 10, 50);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({ destination: "São Paulo", page: 2, limit: 10 });
      
      const hasPreviousPage = result.pagination.page > 1;
      expect(hasPreviousPage).toBe(true);
    });

    it("não deve ter próxima página na última página", async () => {
      const mockResponse = createMockPaginatedResponse(5, 10, 50);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({ destination: "São Paulo", page: 5, limit: 10 });
      
      const hasNextPage = result.pagination.page < result.pagination.totalPages;
      expect(hasNextPage).toBe(false);
    });

    it("não deve ter página anterior na primeira página", async () => {
      const mockResponse = createMockPaginatedResponse(1, 10, 50);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({ destination: "São Paulo", page: 1, limit: 10 });
      
      const hasPreviousPage = result.pagination.page > 1;
      expect(hasPreviousPage).toBe(false);
    });
  });

  describe("Casos extremos de paginação", () => {
    it("deve lidar com resultado vazio", async () => {
      const mockResponse: PaginatedResponse<Hotel> = {
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({ destination: "Cidade Inexistente" });
      
      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    it("deve lidar com página além do total", async () => {
      const mockResponse: PaginatedResponse<Hotel> = {
        data: [],
        pagination: { page: 10, limit: 10, total: 25, totalPages: 3 },
      };
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({ destination: "São Paulo", page: 10, limit: 10 });
      
      expect(result.data).toHaveLength(0);
      expect(result.pagination.page).toBe(10);
    });

    it("deve lidar com limite muito grande", async () => {
      const mockResponse = createMockPaginatedResponse(1, 1000, 25);
      mockFetch.mockResolvedValue(mockResponse);
      
      const { searchHotels } = useHotels();
      const result = await searchHotels({ destination: "São Paulo", page: 1, limit: 1000 });
      
      expect(result.data).toHaveLength(25);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("deve propagar erro quando a busca paginada falha", async () => {
      const error = new Error("Network error");
      mockFetch.mockRejectedValue(error);
      
      const { searchHotels } = useHotels();
      
      await expect(
        searchHotels({ destination: "São Paulo", page: 1, limit: 10 })
      ).rejects.toThrow("Network error");
    });
  });
});

