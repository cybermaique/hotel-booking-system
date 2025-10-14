import { $fetch } from "ofetch";
import type { Hotel, PaginatedResponse, SearchParams } from "~/types/hotel";

/**
 * Composable para operações relacionadas a hotéis.
 *
 * Fornece funções para buscar, filtrar e ordenar hotéis da API mock.
 *
 * @returns Objeto com funções para manipular dados de hotéis
 *
 * Side-effects:
 * - Faz requisições HTTP para /api/hotels
 * - Loga erros no console em caso de falha nas requisições
 *
 * Trade-offs:
 * - getHotelById retorna null em caso de erro (fail-safe para UX)
 * - getHotelsByIds retorna array vazio em caso de erro (fail-safe)
 * - searchHotels propaga o erro (permite tratamento específico no componente)
 */
export const useHotels = () => {
  /**
   * Busca hotéis com parâmetros de pesquisa e paginação.
   * @throws Propaga erros da API para tratamento no componente
   */
  const searchHotels = async (
    params: SearchParams & { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Hotel>> => {
    try {
      const response = await $fetch<PaginatedResponse<Hotel>>("/api/hotels", {
        query: params,
      });
      return response;
    } catch (error) {
      console.error("Erro ao buscar hotéis:", error);
      throw error;
    }
  };

  /**
   * Busca um hotel específico por ID.
   * @returns Hotel encontrado ou null se não existir/houver erro
   */
  const getHotelById = async (id: string): Promise<Hotel | null> => {
    try {
      const hotel = await $fetch<Hotel>(`/api/hotels/${id}`);
      return hotel;
    } catch (error) {
      console.error("Erro ao buscar hotel:", error);
      return null;
    }
  };

  /**
   * Busca múltiplos hotéis por IDs (usado na comparação).
   * @returns Array de hotéis encontrados ou array vazio em caso de erro
   */
  const getHotelsByIds = async (ids: string[]): Promise<Hotel[]> => {
    try {
      const res = await $fetch<Hotel[] | PaginatedResponse<Hotel>>(
        "/api/hotels",
        {
          query: { ids: ids.join(",") },
        }
      );

      const data = Array.isArray(res) ? res : res?.data;
      return data ?? [];
    } catch (error) {
      console.error("Erro ao buscar hotéis por IDs:", error);
      return [];
    }
  };

  /**
   * Filtra hotéis client-side com múltiplos critérios.
   * Útil para refinamento após busca inicial.
   */
  const searchWithFilters = (
    hotels: Hotel[],
    filters: {
      minPrice?: number;
      maxPrice?: number;
      minRating?: number;
      amenities?: string[];
      category?: string;
    }
  ): Hotel[] => {
    return hotels.filter((hotel) => {
      if (filters.minPrice && hotel.pricePerNight < filters.minPrice)
        return false;
      if (filters.maxPrice && hotel.pricePerNight > filters.maxPrice)
        return false;
      if (filters.minRating && hotel.rating < filters.minRating) return false;
      if (filters.category && hotel.category !== filters.category) return false;
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity) =>
          hotel.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      return true;
    });
  };

  /**
   * Ordena hotéis por critério especificado.
   * @returns Novo array ordenado (não modifica o original)
   */
  const sortHotels = (
    hotels: Hotel[],
    sortBy: "price" | "rating" | "name"
  ): Hotel[] => {
    return [...hotels].sort((a, b) => {
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
  };

  return {
    searchHotels,
    getHotelById,
    getHotelsByIds,
    searchWithFilters,
    sortHotels,
  };
};
