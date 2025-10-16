import { defineEventHandler, readBody, createError } from "h3";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);
import type {
  ReservationPayload,
  ReservationResponse,
} from "../../types/hotel";

/**
 * API endpoint para criar reservas de hotéis (mock).
 *
 * POST /api/reserve
 *
 * Request body: ReservationPayload
 * {
 *   hotelId: string
 *   guestName: string
 *   guestEmail: string
 *   guestPhone: string
 *   checkIn: string (ISO date)
 *   checkOut: string (ISO date)
 *   rooms: number
 *   guests: number
 *   paymentMethod: 'credit_card' | 'debit_card' | 'pix'
 *   cardNumber?: string (obrigatório para cartão)
 *   cardExpiry?: string (obrigatório para cartão)
 *   cardCvv?: string (obrigatório para cartão)
 *   cardName?: string (obrigatório para cartão)
 *   specialRequests?: string
 * }
 *
 * Response: ReservationResponse
 * {
 *   success: boolean
 *   reservationId?: string
 *   message?: string
 *   error?: string
 * }
 *
 * Cenários de erro simulados (para testes):
 * - Email contendo "error" → 500 Internal Server Error
 * - Cartão terminando em "0000" → Falha de pagamento
 * - Dados inválidos → 400 Bad Request
 *
 * Trade-offs:
 * - Delay artificial de 1-3s para simular processamento real
 * - Validação de cartão apenas para métodos credit_card/debit_card
 * - PIX não requer dados de cartão
 */
export default defineEventHandler(
  async (event): Promise<ReservationResponse> => {
    const body = (await readBody(event)) as ReservationPayload;

    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 1000)
    );

    if (body.guestEmail?.includes("error")) {
      throw createError({
        statusCode: 500,
        statusMessage: "Reservation Error",
        message: "Erro ao processar reserva. Tente novamente.",
      });
    }

    if (body.cardNumber?.endsWith("0000")) {
      return {
        success: false,
        error: "Falha no pagamento. Verifique os dados do cartão.",
      };
    }

    const errors: string[] = [];

    if (!body.hotelId) errors.push("ID do hotel é obrigatório");
    if (!body.guestName?.trim()) errors.push("Nome do hóspede é obrigatório");
    if (!body.guestEmail?.trim()) errors.push("Email é obrigatório");
    if (!body.guestPhone?.trim()) errors.push("Telefone é obrigatório");
    if (!body.checkIn) errors.push("Data de check-in é obrigatória");
    if (!body.checkOut) errors.push("Data de check-out é obrigatória");
    if (!body.rooms || body.rooms < 1)
      errors.push("Número de quartos inválido");
    if (!body.guests || body.guests < 1)
      errors.push("Número de hóspedes inválido");
    if (!body.paymentMethod) errors.push("Método de pagamento é obrigatório");

    if (body.checkIn && body.checkOut) {
      const checkInDate = dayjs(body.checkIn, "YYYY-MM-DD");
      const checkOutDate = dayjs(body.checkOut, "YYYY-MM-DD");
      const today = dayjs().startOf("day");

      if (checkInDate.isBefore(today)) {
        errors.push("Data de check-in deve ser hoje ou no futuro");
      }

      if (checkOutDate.isSameOrBefore(checkInDate)) {
        errors.push("Data de check-out deve ser após o check-in");
      }
    }

    if (
      body.paymentMethod === "credit_card" ||
      body.paymentMethod === "debit_card"
    ) {
      if (!body.cardNumber?.trim())
        errors.push("Número do cartão é obrigatório");
      if (!body.cardExpiry?.trim())
        errors.push("Data de validade é obrigatória");
      if (!body.cardCvv?.trim()) errors.push("CVV é obrigatório");
      if (!body.cardName?.trim()) errors.push("Nome no cartão é obrigatório");
    }

    if (errors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation Error",
        message: errors.join(", "),
      });
    }

    const reservationId = `RES-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    return {
      success: true,
      reservationId,
      message: "Reserva criada com sucesso!",
    };
  }
);
