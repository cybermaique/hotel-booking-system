import { $fetch } from "ofetch";
import type { ReservationPayload, ReservationResponse } from "~/types/hotel";

export const useReservation = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const createReservation = async (
    payload: ReservationPayload
  ): Promise<ReservationResponse | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch<ReservationResponse>("/api/reserve", {
        method: "POST",
        body: payload,
      });

      return response;
    } catch (err: any) {
      error.value = err.message || "Erro ao criar reserva";
      console.error("Erro na reserva:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const validateReservationData = (
    data: Partial<ReservationPayload>
  ): string[] => {
    const errors: string[] = [];

    if (!data.hotelId) {
      errors.push("ID do hotel é obrigatório");
    }

    if (!data.guestName?.trim()) {
      errors.push("Nome do hóspede é obrigatório");
    }

    if (!data.guestEmail?.trim()) {
      errors.push("Email é obrigatório");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guestEmail)) {
      errors.push("Email inválido");
    }

    if (!data.guestPhone?.trim()) {
      errors.push("Telefone é obrigatório");
    }

    if (!data.checkIn) {
      errors.push("Data de check-in é obrigatória");
    }

    if (!data.checkOut) {
      errors.push("Data de check-out é obrigatória");
    }

    if (data.checkIn && data.checkOut) {
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        errors.push("Data de check-in deve ser hoje ou no futuro");
      }

      if (checkOutDate <= checkInDate) {
        errors.push("Data de check-out deve ser após o check-in");
      }
    }

    if (!data.rooms || data.rooms < 1) {
      errors.push("Número de quartos deve ser pelo menos 1");
    }

    if (!data.guests || data.guests < 1) {
      errors.push("Número de hóspedes deve ser pelo menos 1");
    }

    if (!data.paymentMethod) {
      errors.push("Método de pagamento é obrigatório");
    }

    if (data.paymentMethod === "credit_card" || data.paymentMethod === "debit_card") {
      if (!data.cardNumber?.trim()) {
        errors.push("Número do cartão é obrigatório");
      }
      if (!data.cardExpiry?.trim()) {
        errors.push("Data de validade do cartão é obrigatória");
      }
      if (!data.cardCvv?.trim()) {
        errors.push("CVV do cartão é obrigatório");
      }
      if (!data.cardName?.trim()) {
        errors.push("Nome no cartão é obrigatório");
      }
    }

    return errors;
  };

  const calculateTotalPrice = (
    pricePerNight: number,
    checkIn: string,
    checkOut: string,
    rooms: number
  ): number => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return pricePerNight * nights * rooms;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return {
    createReservation,
    validateReservationData,
    calculateTotalPrice,
    formatCurrency,
    isLoading: readonly(isLoading),
    error: readonly(error),
  };
};
