import { describe, it, expect, beforeEach, vi } from "vitest";
import { useDateUtils } from "~/composables/useDateUtils";

describe("useDateUtils", () => {
  let dateUtils: ReturnType<typeof useDateUtils>;

  beforeEach(() => {
    dateUtils = useDateUtils();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-10-16T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getTodayString", () => {
    it("deve retornar data de hoje no formato YYYY-MM-DD", () => {
      const today = dateUtils.getTodayString();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getTomorrowString", () => {
    it("deve retornar data de amanhã no formato YYYY-MM-DD", () => {
      const tomorrow = dateUtils.getTomorrowString();
      expect(tomorrow).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("parseLocalDate", () => {
    it("deve converter string de data para objeto Date", () => {
      const date = dateUtils.parseLocalDate("2025-10-16");
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe("formatDate", () => {
    it("deve formatar Date para YYYY-MM-DD", () => {
      const date = new Date('2025-10-16T12:00:00Z');
      const formatted = dateUtils.formatDate(date);
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("addDays", () => {
    it("deve adicionar dias a uma data", () => {
      const result = dateUtils.addDays("2025-10-16", 5);
      expect(result).toBe("2025-10-21");
    });

    it("deve subtrair dias quando número é negativo", () => {
      const result = dateUtils.addDays("2025-10-16", -5);
      expect(result).toBe("2025-10-11");
    });
  });

  describe("diffInDays", () => {
    it("deve calcular diferença em dias entre duas datas", () => {
      const diff = dateUtils.diffInDays("2025-10-16", "2025-10-21");
      expect(diff).toBe(5);
    });

    it("deve retornar negativo quando data final é anterior", () => {
      const diff = dateUtils.diffInDays("2025-10-21", "2025-10-16");
      expect(diff).toBe(-5);
    });

    it("deve retornar 0 para mesma data", () => {
      const diff = dateUtils.diffInDays("2025-10-16", "2025-10-16");
      expect(diff).toBe(0);
    });
  });

  describe("isTodayOrFuture", () => {
    it("deve retornar true para data de hoje", () => {
      const today = dateUtils.getTodayString();
      expect(dateUtils.isTodayOrFuture(today)).toBe(true);
    });

    it("deve retornar true para data futura", () => {
      expect(dateUtils.isTodayOrFuture("2025-12-31")).toBe(true);
    });

    it("deve retornar false para data passada", () => {
      expect(dateUtils.isTodayOrFuture("2025-01-01")).toBe(false);
    });
  });

  describe("isPast", () => {
    it("deve retornar true para data passada", () => {
      expect(dateUtils.isPast("2025-01-01")).toBe(true);
    });

    it("deve retornar false para data de hoje", () => {
      const today = dateUtils.getTodayString();
      expect(dateUtils.isPast(today)).toBe(false);
    });

    it("deve retornar false para data futura", () => {
      expect(dateUtils.isPast("2025-12-31")).toBe(false);
    });
  });

  describe("isBefore", () => {
    it("deve retornar true quando date1 é antes de date2", () => {
      expect(dateUtils.isBefore("2025-10-15", "2025-10-16")).toBe(true);
    });

    it("deve retornar false quando date1 é depois de date2", () => {
      expect(dateUtils.isBefore("2025-10-17", "2025-10-16")).toBe(false);
    });

    it("deve retornar false quando datas são iguais", () => {
      expect(dateUtils.isBefore("2025-10-16", "2025-10-16")).toBe(false);
    });
  });

  describe("isAfter", () => {
    it("deve retornar true quando date1 é depois de date2", () => {
      expect(dateUtils.isAfter("2025-10-17", "2025-10-16")).toBe(true);
    });

    it("deve retornar false quando date1 é antes de date2", () => {
      expect(dateUtils.isAfter("2025-10-15", "2025-10-16")).toBe(false);
    });

    it("deve retornar false quando datas são iguais", () => {
      expect(dateUtils.isAfter("2025-10-16", "2025-10-16")).toBe(false);
    });
  });

  describe("isSame", () => {
    it("deve retornar true quando datas são iguais", () => {
      expect(dateUtils.isSame("2025-10-16", "2025-10-16")).toBe(true);
    });

    it("deve retornar false quando datas são diferentes", () => {
      expect(dateUtils.isSame("2025-10-16", "2025-10-17")).toBe(false);
    });
  });

  describe("getNextFriday", () => {
    it("deve retornar próxima sexta-feira", () => {
      const nextFriday = dateUtils.getNextFriday();
      expect(nextFriday).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getNextSunday", () => {
    it("deve retornar próximo domingo", () => {
      const nextSunday = dateUtils.getNextSunday();
      expect(nextSunday).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getNextWeek", () => {
    it("deve retornar data daqui a uma semana", () => {
      const nextWeek = dateUtils.getNextWeek();
      expect(nextWeek).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getNextWeekEnd", () => {
    it("deve retornar data daqui a 9 dias", () => {
      const nextWeekEnd = dateUtils.getNextWeekEnd();
      expect(nextWeekEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getNextMonth", () => {
    it("deve retornar data daqui a um mês", () => {
      const nextMonth = dateUtils.getNextMonth();
      expect(nextMonth).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getNextMonthEnd", () => {
    it("deve retornar data daqui a um mês + 3 dias", () => {
      const nextMonthEnd = dateUtils.getNextMonthEnd();
      expect(nextMonthEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("addYears", () => {
    it("deve adicionar anos a uma data", () => {
      const result = dateUtils.addYears("2025-10-16", 2);
      expect(result).toBe("2027-10-16");
    });

    it("deve subtrair anos quando número é negativo", () => {
      const result = dateUtils.addYears("2025-10-16", -2);
      expect(result).toBe("2023-10-16");
    });
  });
});

