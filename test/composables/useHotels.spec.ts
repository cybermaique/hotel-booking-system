import { describe, it, expect, vi, beforeEach } from "vitest";
import { useHotels } from "~/composables/useHotels";
import type { Hotel } from "~/types/hotel";

const mockFetch = vi.fn();
vi.mock("ofetch", () => ({
  $fetch: (...args: any[]) => mockFetch(...args),
}));

const mockHotels: Hotel[] = [
  {
    id: "1",
    name: "Hotel A",
    location: "São Paulo",
    rating: 4.5,
    pricePerNight: 200,
    images: ["/img1.jpg"],
    amenities: ["Wi-Fi", "Piscina"],
    category: "Luxo",
    featured: true,
    reviewCount: 100,
    description: "A luxurious hotel in São Paulo.",
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Free cancellation up to 24 hours before check-in.",
      pets: true,
    },
  },
  {
    id: "2",
    name: "Hotel B",
    location: "Rio de Janeiro",
    rating: 3.8,
    pricePerNight: 150,
    images: ["/img2.jpg"],
    amenities: ["Wi-Fi", "Academia"],
    category: "Econômico",
    featured: false,
    reviewCount: 50,
    description: "An affordable hotel in Rio de Janeiro.",
    policies: {
      checkIn: "15:00",
      checkOut: "11:00",
      cancellation: "Non-refundable.",
      pets: false,
    },
  },
  {
    id: "3",
    name: "Hotel C",
    location: "Salvador",
    rating: 4.8,
    pricePerNight: 300,
    images: ["/img3.jpg"],
    amenities: ["Wi-Fi", "Piscina", "Academia", "Spa"],
    category: "Luxo",
    featured: true,
    reviewCount: 200,
    description: "A premium hotel in Salvador with top-notch amenities.",
    policies: {
      checkIn: "13:00",
      checkOut: "12:00",
      cancellation: "Free cancellation up to 48 hours before check-in.",
      pets: true,
    },
  },
];

describe("useHotels", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("searchHotels", () => {
    it("deve buscar hotéis com parâmetros", async () => {
      mockFetch.mockResolvedValue(mockHotels);
      const { searchHotels } = useHotels();

      const params = {
        destination: "São Paulo",
        checkIn: "2025-10-15",
        checkOut: "2025-10-20",
        rooms: "1",
        guests: "2",
      };

      const result = await searchHotels(params);

      expect(mockFetch).toHaveBeenCalledWith("/api/hotels", { query: params });
      expect(result).toEqual(mockHotels);
    });

    it("deve lançar erro quando a busca falha", async () => {
      const error = new Error("Network error");
      mockFetch.mockRejectedValue(error);
      const { searchHotels } = useHotels();

      await expect(
        searchHotels({ destination: "Test" } as any)
      ).rejects.toThrow("Network error");
    });
  });

  describe("getHotelById", () => {
    it("deve buscar hotel por ID", async () => {
      mockFetch.mockResolvedValue(mockHotels[0]);
      const { getHotelById } = useHotels();

      const result = await getHotelById("1");

      expect(mockFetch).toHaveBeenCalledWith("/api/hotels/1");
      expect(result).toEqual(mockHotels[0]);
    });

    it("deve retornar null quando a busca falha", async () => {
      mockFetch.mockRejectedValue(new Error("Not found"));
      const { getHotelById } = useHotels();

      const result = await getHotelById("999");

      expect(result).toBeNull();
    });
  });

  describe("getHotelsByIds", () => {
    it("deve buscar múltiplos hotéis por IDs", async () => {
      mockFetch.mockResolvedValue([mockHotels[0], mockHotels[1]]);
      const { getHotelsByIds } = useHotels();

      const result = await getHotelsByIds(["1", "2"]);

      expect(mockFetch).toHaveBeenCalledWith("/api/hotels", {
        query: { ids: "1,2" },
      });
      expect(result).toEqual([mockHotels[0], mockHotels[1]]);
    });

    it("deve retornar array vazio quando a busca falha", async () => {
      mockFetch.mockRejectedValue(new Error("Error"));
      const { getHotelsByIds } = useHotels();

      const result = await getHotelsByIds(["1", "2"]);

      expect(result).toEqual([]);
    });

    it("deve converter array de IDs em string separada por vírgula", async () => {
      mockFetch.mockResolvedValue([]);
      const { getHotelsByIds } = useHotels();

      await getHotelsByIds(["1", "2", "3"]);

      expect(mockFetch).toHaveBeenCalledWith("/api/hotels", {
        query: { ids: "1,2,3" },
      });
    });
  });

  describe("searchWithFilters", () => {
    it("deve filtrar por preço mínimo", () => {
      const { searchWithFilters } = useHotels();

      const result = searchWithFilters(mockHotels, { minPrice: 180 });

      expect(result).toHaveLength(2);
      expect(result.every((h) => h.pricePerNight >= 180)).toBe(true);
    });

    it("deve filtrar por preço máximo", () => {
      const { searchWithFilters } = useHotels();

      const result = searchWithFilters(mockHotels, { maxPrice: 200 });

      expect(result).toHaveLength(2);
      expect(result.every((h) => h.pricePerNight <= 200)).toBe(true);
    });

    it("deve filtrar por rating mínimo", () => {
      const { searchWithFilters } = useHotels();

      const result = searchWithFilters(mockHotels, { minRating: 4.0 });

      expect(result).toHaveLength(2);
      expect(result.every((h) => h.rating >= 4.0)).toBe(true);
    });

    it("deve filtrar por categoria", () => {
      const { searchWithFilters } = useHotels();

      const result = searchWithFilters(mockHotels, { category: "Luxo" });

      expect(result).toHaveLength(2);
      expect(result.every((h) => h.category === "Luxo")).toBe(true);
    });

    it("deve filtrar por amenidades", () => {
      const { searchWithFilters } = useHotels();

      const result = searchWithFilters(mockHotels, { amenities: ["Piscina"] });

      expect(result).toHaveLength(2);
      expect(result.every((h) => h.amenities.includes("Piscina"))).toBe(true);
    });

    it("deve filtrar por múltiplas amenidades (todas devem estar presentes)", () => {
      const { searchWithFilters } = useHotels();

      const result = searchWithFilters(mockHotels, {
        amenities: ["Wi-Fi", "Piscina", "Academia"],
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("3");
    });

    it("deve aplicar múltiplos filtros simultaneamente", () => {
      const { searchWithFilters } = useHotels();

      const result = searchWithFilters(mockHotels, {
        minPrice: 150,
        maxPrice: 250,
        minRating: 4.0,
        category: "Luxo",
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });

    it("deve retornar todos os hotéis quando não há filtros", () => {
      const { searchWithFilters } = useHotels();

      const result = searchWithFilters(mockHotels, {});

      expect(result).toHaveLength(3);
    });

    it("deve retornar array vazio quando nenhum hotel corresponde aos filtros", () => {
      const { searchWithFilters } = useHotels();

      const result = searchWithFilters(mockHotels, { minPrice: 1000 });

      expect(result).toHaveLength(0);
    });
  });

  describe("sortHotels", () => {
    it("deve ordenar por preço crescente", () => {
      const { sortHotels } = useHotels();

      const result = sortHotels(mockHotels, "price");

      expect(result[0].pricePerNight).toBe(150);
      expect(result[1].pricePerNight).toBe(200);
      expect(result[2].pricePerNight).toBe(300);
    });

    it("deve ordenar por rating decrescente", () => {
      const { sortHotels } = useHotels();

      const result = sortHotels(mockHotels, "rating");

      expect(result[0].rating).toBe(4.8);
      expect(result[1].rating).toBe(4.5);
      expect(result[2].rating).toBe(3.8);
    });

    it("deve ordenar por nome alfabeticamente", () => {
      const { sortHotels } = useHotels();

      const result = sortHotels(mockHotels, "name");

      expect(result[0].name).toBe("Hotel A");
      expect(result[1].name).toBe("Hotel B");
      expect(result[2].name).toBe("Hotel C");
    });

    it("não deve modificar o array original", () => {
      const { sortHotels } = useHotels();
      const original = [...mockHotels];

      sortHotels(mockHotels, "price");

      expect(mockHotels).toEqual(original);
    });

    it("deve retornar array vazio quando recebe array vazio", () => {
      const { sortHotels } = useHotels();

      const result = sortHotels([], "price");

      expect(result).toHaveLength(0);
    });
  });
});
