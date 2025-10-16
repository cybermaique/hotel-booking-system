import { describe, it, expect, vi, beforeEach } from "vitest";
import { useReservation } from "~/composables/useReservation";
import type { ReservationPayload } from "~/types/hotel";

const mockFetch = vi.fn();
vi.mock("ofetch", () => ({
  $fetch: (...args: any[]) => mockFetch(...args),
}));

const validPayload: ReservationPayload = {
  hotelId: "1",
  guestName: "João Silva",
  guestEmail: "joao@example.com",
  guestPhone: "11999999999",
  checkIn: "2025-12-15",
  checkOut: "2025-12-20",
  rooms: 1,
  guests: 2,
  paymentMethod: "credit_card",
  cardNumber: "4111111111111111",
  cardExpiry: "12/28",
  cardCvv: "123",
  cardName: "João Silva",
};

describe("useReservation", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("createReservation", () => {
    it("deve criar reserva com sucesso", async () => {
      const mockResponse = {
        success: true,
        reservationId: "RES123",
        message: "Reserva criada com sucesso",
      };
      mockFetch.mockResolvedValue(mockResponse);

      const { createReservation } = useReservation();
      const result = await createReservation(validPayload);

      expect(mockFetch).toHaveBeenCalledWith("/api/reserve", {
        method: "POST",
        body: validPayload,
      });
      expect(result).toEqual(mockResponse);
    });

    it("deve definir isLoading durante a requisição", async () => {
      mockFetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { createReservation, isLoading } = useReservation();

      expect(isLoading.value).toBe(false);

      const promise = createReservation(validPayload);
      expect(isLoading.value).toBe(true);

      await promise;
      expect(isLoading.value).toBe(false);
    });

    it("deve retornar null e definir erro quando falha", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const { createReservation, error } = useReservation();
      const result = await createReservation(validPayload);

      expect(result).toBeNull();
      expect(error.value).toBe("Network error");
    });

    it("deve limpar erro anterior ao fazer nova requisição", async () => {
      mockFetch.mockRejectedValueOnce(new Error("First error"));
      mockFetch.mockResolvedValueOnce({ success: true });

      const { createReservation, error } = useReservation();

      await createReservation(validPayload);
      expect(error.value).toBe("First error");

      await createReservation(validPayload);
      expect(error.value).toBeNull();
    });
  });

  describe("validateReservationData", () => {
    it("deve validar dados completos e válidos", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData(validPayload);

      expect(errors).toHaveLength(0);
    });

    it("deve validar hotelId obrigatório", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({ ...validPayload, hotelId: "" });

      expect(errors).toContain("ID do hotel é obrigatório");
    });

    it("deve validar nome do hóspede obrigatório", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        guestName: "",
      });

      expect(errors).toContain("Nome do hóspede é obrigatório");
    });

    it("deve validar email obrigatório", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        guestEmail: "",
      });

      expect(errors).toContain("Email é obrigatório");
    });

    it("deve validar formato de email", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        guestEmail: "email-invalido",
      });

      expect(errors).toContain("Email inválido");
    });

    it("deve aceitar email válido", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        guestEmail: "teste@example.com",
      });

      expect(errors.filter((e) => e.includes("Email"))).toHaveLength(0);
    });

    it("deve validar telefone obrigatório", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        guestPhone: "",
      });

      expect(errors).toContain("Telefone é obrigatório");
    });

    it("deve validar check-in obrigatório", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({ ...validPayload, checkIn: "" });

      expect(errors).toContain("Data de check-in é obrigatória");
    });

    it("deve validar check-out obrigatório", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({ ...validPayload, checkOut: "" });

      expect(errors).toContain("Data de check-out é obrigatória");
    });

    it("deve validar que check-in não seja no passado", () => {
      const { validateReservationData } = useReservation();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const errors = validateReservationData({
        ...validPayload,
        checkIn: yesterday.toISOString().split("T")[0],
      });

      expect(errors).toContain("Data de check-in deve ser hoje ou no futuro");
    });

    it("deve validar que check-out seja após check-in", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        checkIn: "2025-10-20",
        checkOut: "2025-10-15",
      });

      expect(errors).toContain("Data de check-out deve ser após o check-in");
    });

    it("deve validar número mínimo de quartos", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({ ...validPayload, rooms: 0 });

      expect(errors).toContain("Número de quartos deve ser pelo menos 1");
    });

    it("deve validar número mínimo de hóspedes", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({ ...validPayload, guests: 0 });

      expect(errors).toContain("Número de hóspedes deve ser pelo menos 1");
    });

    it("deve validar método de pagamento obrigatório", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        paymentMethod: "" as any,
      });

      expect(errors).toContain("Método de pagamento é obrigatório");
    });

    it("deve validar dados do cartão quando método é credit_card", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        paymentMethod: "credit_card",
        cardNumber: "",
        cardExpiry: "",
        cardCvv: "",
        cardName: "",
      });

      expect(errors).toContain("Número do cartão é obrigatório");
      expect(errors).toContain("Data de validade do cartão é obrigatória");
      expect(errors).toContain("CVV do cartão é obrigatório");
      expect(errors).toContain("Nome no cartão é obrigatório");
    });

    it("deve validar dados do cartão quando método é debit_card", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        paymentMethod: "debit_card",
        cardNumber: "",
      });

      expect(errors).toContain("Número do cartão é obrigatório");
    });

    it("não deve validar dados do cartão para outros métodos de pagamento", () => {
      const { validateReservationData } = useReservation();

      const errors = validateReservationData({
        ...validPayload,
        paymentMethod: "pix",
        cardNumber: undefined,
        cardExpiry: undefined,
        cardCvv: undefined,
        cardName: undefined,
      });

      expect(errors.filter((e) => e.includes("cartão"))).toHaveLength(0);
    });
  });

  describe("calculateTotalPrice", () => {
    it("deve calcular preço total corretamente", () => {
      const { calculateTotalPrice } = useReservation();

      const total = calculateTotalPrice(100, "2025-10-15", "2025-10-20", 2);

      // 5 noites * 100 por noite * 2 quartos = 1000
      expect(total).toBe(1000);
    });

    it("deve calcular para uma noite", () => {
      const { calculateTotalPrice } = useReservation();

      const total = calculateTotalPrice(200, "2025-10-15", "2025-10-16", 1);

      expect(total).toBe(200);
    });

    it("deve calcular para múltiplos quartos", () => {
      const { calculateTotalPrice } = useReservation();

      const total = calculateTotalPrice(150, "2025-10-15", "2025-10-17", 3);

      // 2 noites * 150 * 3 quartos = 900
      expect(total).toBe(900);
    });

    it("deve arredondar para cima quando há fração de dia", () => {
      const { calculateTotalPrice } = useReservation();

      // Mesmo que tecnicamente seja menos de um dia completo, deve contar como 1 noite
      const total = calculateTotalPrice(100, "2025-10-15", "2025-10-16", 1);

      expect(total).toBeGreaterThan(0);
    });
  });

  describe("formatCurrency", () => {
    it("deve formatar valor em reais", () => {
      const { formatCurrency } = useReservation();

      const formatted = formatCurrency(1000);

      expect(formatted).toContain("1.000");
      expect(formatted).toContain("R$");
    });

    it("deve formatar valores decimais", () => {
      const { formatCurrency } = useReservation();

      const formatted = formatCurrency(1234.56);

      expect(formatted).toContain("1.234,56");
    });

    it("deve formatar zero", () => {
      const { formatCurrency } = useReservation();

      const formatted = formatCurrency(0);

      expect(formatted).toContain("0");
      expect(formatted).toContain("R$");
    });

    it("deve formatar valores grandes", () => {
      const { formatCurrency } = useReservation();

      const formatted = formatCurrency(1000000);

      expect(formatted).toContain("1.000.000");
    });
  });

  describe("Estados reativos", () => {
    it("deve ter isLoading como readonly", () => {
      const { isLoading } = useReservation();

      expect(isLoading.value).toBe(false);
    });

    it("deve ter error como readonly", () => {
      const { error } = useReservation();

      expect(error.value).toBeNull();
    });
  });

  describe("Validação de data de check-in - Bug Fix", () => {
    it("deve aceitar data de hoje como check-in válido", () => {
      const { validateReservationData } = useReservation();

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      const errors = validateReservationData({
        ...validPayload,
        checkIn: todayStr,
        checkOut: tomorrowStr,
      });

      // Não deve haver erro relacionado a check-in no passado
      expect(errors).not.toContain("Data de check-in deve ser hoje ou no futuro");
      expect(errors.filter((e) => e.includes("check-in"))).toHaveLength(0);
    });

    it("deve rejeitar data de ontem como check-in", () => {
      const { validateReservationData } = useReservation();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const errors = validateReservationData({
        ...validPayload,
        checkIn: yesterdayStr,
      });

      expect(errors).toContain("Data de check-in deve ser hoje ou no futuro");
    });

    it("deve aceitar data futura como check-in", () => {
      const { validateReservationData } = useReservation();

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split("T")[0];
      
      const nextWeekPlus1 = new Date(nextWeek);
      nextWeekPlus1.setDate(nextWeekPlus1.getDate() + 1);
      const nextWeekPlus1Str = nextWeekPlus1.toISOString().split("T")[0];

      const errors = validateReservationData({
        ...validPayload,
        checkIn: nextWeekStr,
        checkOut: nextWeekPlus1Str,
      });

      expect(errors.filter((e) => e.includes("check-in"))).toHaveLength(0);
    });

    it("deve validar corretamente múltiplas datas de check-in", () => {
      const { validateReservationData } = useReservation();

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);
      const dayAfterStr = dayAfter.toISOString().split("T")[0];

      // Teste com hoje
      const errorsToday = validateReservationData({
        ...validPayload,
        checkIn: todayStr,
        checkOut: tomorrowStr,
      });
      expect(errorsToday.filter((e) => e.includes("check-in deve ser"))).toHaveLength(0);

      // Teste com amanhã
      const errorsTomorrow = validateReservationData({
        ...validPayload,
        checkIn: tomorrowStr,
        checkOut: dayAfterStr,
      });
      expect(errorsTomorrow.filter((e) => e.includes("check-in deve ser"))).toHaveLength(0);
    });
  });
});

