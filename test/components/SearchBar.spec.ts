import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import SearchBar from "~/layers/design-system/components/molecules/SearchBar.vue";

// Componente SearchBar depende de muitos componentes do design system
// Vamos simplificar os testes para focar na lógica principal
describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Renderização básica", () => {
    it("deve renderizar corretamente", () => {
      const wrapper = mount(SearchBar);
      expect(wrapper.find("form").exists()).toBe(true);
    });

    it("deve renderizar todos os campos de entrada", () => {
      const wrapper = mount(SearchBar);

      expect(wrapper.find('input[type="text"]').exists()).toBe(true); // destination
      expect(wrapper.findAll('input[type="date"]').length).toBe(2); // check-in e check-out
      expect(wrapper.findAll("select").length).toBe(2); // rooms e guests
    });

    it("deve renderizar botão de busca", () => {
      const wrapper = mount(SearchBar);

      const button = wrapper.find('button[type="submit"]');
      expect(button.exists()).toBe(true);
      expect(button.text()).toContain("Buscar Hotéis");
    });

    it("deve renderizar filtros rápidos", () => {
      const wrapper = mount(SearchBar);

      const quickFilters = wrapper.findAll('button[type="button"]');
      expect(quickFilters.length).toBeGreaterThan(0);
    });
  });

  describe("Valores padrão", () => {
    it("deve ter valores padrão corretos", () => {
      const wrapper = mount(SearchBar);

      const selects = wrapper.findAll("select");
      const roomsSelect = selects[0].element as HTMLSelectElement;
      const guestsSelect = selects[1].element as HTMLSelectElement;

      expect(roomsSelect.value).toBe("1");
      expect(guestsSelect.value).toBe("2");
    });

    it("deve ter campo de destino vazio inicialmente", () => {
      const wrapper = mount(SearchBar);

      const destinationInput = wrapper.find('input[type="text"]')
        .element as HTMLInputElement;
      expect(destinationInput.value).toBe("");
    });
  });

  describe("Validação de formulário", () => {
    it("deve validar destino obrigatório", async () => {
      const wrapper = mount(SearchBar);

      await wrapper.find("form").trigger("submit.prevent");

      expect(wrapper.text()).toContain("Destino é obrigatório");
    });

    it("deve validar check-in obrigatório", async () => {
      const wrapper = mount(SearchBar);

      const destinationInput = wrapper.find('input[type="text"]');
      await destinationInput.setValue("São Paulo");

      await wrapper.find("form").trigger("submit.prevent");

      expect(wrapper.text()).toContain("Data de check-in é obrigatória");
    });

    it("deve validar check-out obrigatório", async () => {
      const wrapper = mount(SearchBar);

      const destinationInput = wrapper.find('input[type="text"]');
      await destinationInput.setValue("São Paulo");

      const dateInputs = wrapper.findAll('input[type="date"]');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await dateInputs[0].setValue(tomorrow.toISOString().split("T")[0]);

      await wrapper.find("form").trigger("submit.prevent");

      expect(wrapper.text()).toContain("Data de check-out é obrigatória");
    });

    it("deve validar que check-out seja após check-in", async () => {
      const wrapper = mount(SearchBar);

      const destinationInput = wrapper.find('input[type="text"]');
      await destinationInput.setValue("São Paulo");

      const dateInputs = wrapper.findAll('input[type="date"]');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      await dateInputs[0].setValue(tomorrowStr);
      await dateInputs[1].setValue(tomorrowStr); // mesma data

      await wrapper.find("form").trigger("submit.prevent");

      expect(wrapper.text()).toContain(
        "Data de check-out deve ser após o check-in"
      );
    });

    it("deve validar que check-in não seja no passado", async () => {
      const wrapper = mount(SearchBar);

      // preenche destino
      await wrapper.find('input[type="text"]').setValue("São Paulo");

      const [checkIn, checkOut] = wrapper.findAll('input[type="date"]');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      await checkIn.setValue(yesterday.toISOString().split("T")[0]);
      await checkOut.setValue(dayAfterTomorrow.toISOString().split("T")[0]);
      await wrapper.find("form").trigger("submit.prevent");

      expect(wrapper.text()).toContain(
        "Data de check-in deve ser hoje ou no futuro"
      );
    });
  });

  describe("Emissão de eventos", () => {
    it("deve emitir evento search com dados válidos", async () => {
      const wrapper = mount(SearchBar);

      const destinationInput = wrapper.find('input[type="text"]');
      await destinationInput.setValue("São Paulo");

      const dateInputs = wrapper.findAll('input[type="date"]');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

      await dateInputs[0].setValue(tomorrow.toISOString().split("T")[0]);
      await dateInputs[1].setValue(
        dayAfterTomorrow.toISOString().split("T")[0]
      );

      await wrapper.find("form").trigger("submit.prevent");

      expect(wrapper.emitted("search")).toBeTruthy();
      const searchEvent = wrapper.emitted("search")?.[0]?.[0] as any;
      expect(searchEvent.destination).toBe("São Paulo");
      expect(searchEvent.rooms).toBe("1");
      expect(searchEvent.guests).toBe("2");
    });

    it("não deve emitir evento search com dados inválidos", async () => {
      const wrapper = mount(SearchBar);

      await wrapper.find("form").trigger("submit.prevent");

      expect(wrapper.emitted("search")).toBeFalsy();
    });
  });

  describe("Sugestões de destino", () => {
    it("deve mostrar sugestões ao focar no campo de destino com texto", async () => {
      const wrapper = mount(SearchBar);

      const destinationInput = wrapper.find('input[type="text"]');
      await destinationInput.setValue("Rio");
      await destinationInput.trigger("focus");

      await wrapper.vm.$nextTick();

      const suggestions = wrapper.find(".absolute.top-full");
      expect(suggestions.exists()).toBe(true);
    });

    it("deve selecionar sugestão ao clicar", async () => {
      const wrapper = mount(SearchBar);

      const destinationInput = wrapper.find('input[type="text"]');
      await destinationInput.setValue("Rio");
      await destinationInput.trigger("focus");

      await wrapper.vm.$nextTick();

      const firstSuggestion = wrapper.find(".px-4.py-3");
      await firstSuggestion.trigger("click");

      const input = wrapper.find('input[type="text"]')
        .element as HTMLInputElement;
      expect(input.value).toBeTruthy();
    });
  });

  describe("Filtros rápidos", () => {
    it("deve aplicar filtro rápido ao clicar", async () => {
      const wrapper = mount(SearchBar);

      const quickFilterButtons = wrapper.findAll('button[type="button"]');
      await quickFilterButtons[0].trigger("click");

      const dateInputs = wrapper.findAll('input[type="date"]');
      const checkInValue = (dateInputs[0].element as HTMLInputElement).value;
      const checkOutValue = (dateInputs[1].element as HTMLInputElement).value;

      expect(checkInValue).toBeTruthy();
      expect(checkOutValue).toBeTruthy();
    });
  });

  describe("Estado de loading", () => {
    it("deve mostrar estado de loading quando loading é true", () => {
      const wrapper = mount(SearchBar, {
        props: {
          loading: true,
        },
      });

      const button = wrapper.find('button[type="submit"]');
      expect(button.text()).toContain("Buscando...");
    });

    it("deve mostrar texto normal quando loading é false", () => {
      const wrapper = mount(SearchBar, {
        props: {
          loading: false,
        },
      });

      const button = wrapper.find('button[type="submit"]');
      expect(button.text()).toContain("Buscar Hotéis");
    });
  });

  describe("Seleção de quartos e hóspedes", () => {
    it("deve permitir selecionar número de quartos", async () => {
      const wrapper = mount(SearchBar);

      const selects = wrapper.findAll("select");
      const roomsSelect = selects[0];

      await roomsSelect.setValue("3");

      expect((roomsSelect.element as HTMLSelectElement).value).toBe("3");
    });

    it("deve permitir selecionar número de hóspedes", async () => {
      const wrapper = mount(SearchBar);

      const selects = wrapper.findAll("select");
      const guestsSelect = selects[1];

      await guestsSelect.setValue("4");

      expect((guestsSelect.element as HTMLSelectElement).value).toBe("4");
    });
  });

  describe("Atributos de data", () => {
    it("deve definir min date para hoje", () => {
      const wrapper = mount(SearchBar);

      const dateInputs = wrapper.findAll('input[type="date"]');
      const checkInInput = dateInputs[0];

      const today = new Date().toISOString().split("T")[0];
      expect(checkInInput.attributes("min")).toBe(today);
    });

    it("deve definir min date do check-out baseado no check-in", async () => {
      const wrapper = mount(SearchBar);

      const dateInputs = wrapper.findAll('input[type="date"]');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      await dateInputs[0].setValue(tomorrowStr);
      await wrapper.vm.$nextTick();

      const checkOutInput = dateInputs[1];
      expect(checkOutInput.attributes("min")).toBe(tomorrowStr);
    });
  });
});
