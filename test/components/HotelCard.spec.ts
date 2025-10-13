import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import HotelCard from "~/layers/design-system/components/molecules/HotelCard.vue";

const mockHotel = {
  id: "1",
  name: "Hotel Teste",
  location: "São Paulo, SP",
  rating: 4.5,
  pricePerNight: 250,
  images: ["/images/hotel_1.jpg", "/images/hotel_1_2.jpg"],
  amenities: ["Wi-Fi", "Piscina", "Academia", "Restaurante"],
  category: "Luxo",
  featured: true,
  reviewCount: 150,
  description: "Um hotel de luxo no coração de São Paulo.",
  policies: {
    checkIn: "14h",
    checkOut: "12h",
    cancellation: "Cancelamento grátis até 24h antes do check-in",
    pets: false,
  },
};

// Componente HotelCard depende de muitos componentes do design system
// Vamos simplificar os testes para focar na lógica principal
describe("HotelCard", () => {
  describe("Renderização básica", () => {
    it("deve renderizar corretamente", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.find(".bg-white\\/80").exists()).toBe(true);
    });

    it("deve renderizar nome do hotel", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("Hotel Teste");
    });

    it("deve renderizar localização do hotel", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("São Paulo, SP");
    });

    it("deve renderizar preço por noite", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("250");
      expect(wrapper.text()).toContain("/noite");
    });

    it("deve renderizar rating", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("4.5");
    });
  });

  describe("Imagens", () => {
    it("deve renderizar primeira imagem por padrão", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      const img = wrapper.find("img");
      expect(img.attributes("src")).toBe("/images/hotel_1.jpg");
    });

    it("deve renderizar alt text correto", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      const img = wrapper.find("img");
      expect(img.attributes("alt")).toContain("Hotel Teste");
    });

    it("deve mostrar navegação de imagens quando há múltiplas imagens", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      const imageNavButtons = wrapper.findAll(".w-2.h-2.rounded-full");
      expect(imageNavButtons.length).toBe(2);
    });

    it("não deve mostrar navegação quando há apenas uma imagem", () => {
      const hotelWithOneImage = {
        ...mockHotel,
        images: ["/images/hotel_1.jpg"],
      };

      const wrapper = mount(HotelCard, {
        props: {
          hotel: hotelWithOneImage,
        },
      });

      const imageNav = wrapper.find(".absolute.inset-x-0.bottom-4");
      expect(imageNav.exists()).toBe(false);
    });

    it("deve mudar imagem ao clicar nos botões de navegação", async () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      const navButtons = wrapper.findAll(".w-2.h-2.rounded-full");
      await navButtons[1].trigger("click");

      await wrapper.vm.$nextTick();

      const img = wrapper.find("img");
      expect(img.attributes("src")).toBe("/images/hotel_1_2.jpg");
    });
  });

  describe("Badges", () => {
    it('deve mostrar badge "Destaque" quando featured é true', () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("Destaque");
    });

    it("deve mostrar categoria quando featured é false", () => {
      const hotelNotFeatured = {
        ...mockHotel,
        featured: false,
      };

      const wrapper = mount(HotelCard, {
        props: {
          hotel: hotelNotFeatured,
        },
      });

      expect(wrapper.text()).toContain("Luxo");
    });

    it("deve renderizar até 3 amenities", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("Wi-Fi");
      expect(wrapper.text()).toContain("Piscina");
      expect(wrapper.text()).toContain("Academia");
    });

    it("deve mostrar contador de amenities restantes", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("+1");
    });

    it("não deve mostrar contador quando há 3 ou menos amenities", () => {
      const hotelWithFewAmenities = {
        ...mockHotel,
        amenities: ["Wi-Fi", "Piscina"],
      };

      const wrapper = mount(HotelCard, {
        props: {
          hotel: hotelWithFewAmenities,
        },
      });

      expect(wrapper.text()).not.toContain("+");
    });
  });

  describe("Checkbox de comparação", () => {
    it("deve mostrar checkbox quando showCompareCheckbox é true", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
          showCompareCheckbox: true,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.exists()).toBe(true);
    });

    it("não deve mostrar checkbox quando showCompareCheckbox é false", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
          showCompareCheckbox: false,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      expect(checkbox.exists()).toBe(false);
    });

    it("deve refletir estado selected", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
          showCompareCheckbox: true,
          selected: true,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]')
        .element as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it("deve emitir toggle-compare ao mudar checkbox", async () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
          showCompareCheckbox: true,
          selected: false,
        },
      });

      const checkbox = wrapper.find('input[type="checkbox"]');
      await checkbox.setValue(true);

      expect(wrapper.emitted("toggle-compare")).toBeTruthy();
      expect(wrapper.emitted("toggle-compare")?.[0]).toEqual(["1", true]);
    });
  });

  describe("Botão de detalhes", () => {
    it('deve renderizar botão "Ver Detalhes"', () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("Ver Detalhes");
    });
  });

  describe("Informações adicionais", () => {
    it("deve mostrar contagem de avaliações", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("150 avaliações");
    });

    it("deve mostrar 0 avaliações quando reviewCount não está definido", () => {
      const hotelWithoutReviews = {
        ...mockHotel,
        reviewCount: undefined,
      };

      const wrapper = mount(HotelCard, {
        props: {
          hotel: hotelWithoutReviews as any,
        },
      });

      expect(wrapper.text()).toContain("0 avaliações");
    });

    it("deve mostrar informações de check-in", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("Check-in 14h");
    });

    it("deve mostrar informação de cancelamento", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      expect(wrapper.text()).toContain("Cancelamento grátis");
    });
  });

  describe("Botão de favorito", () => {
    it("deve renderizar botão de favorito", () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
        },
      });

      const favoriteButton = wrapper.find(".group\\/heart");
      expect(favoriteButton.exists()).toBe(true);
    });
  });

  describe("Formatação de preço", () => {
    it("deve formatar preço corretamente para valores grandes", () => {
      const expensiveHotel = {
        ...mockHotel,
        pricePerNight: 1500,
      };

      const wrapper = mount(HotelCard, {
        props: {
          hotel: expensiveHotel,
        },
      });

      expect(wrapper.text()).toContain("1.500");
    });

    it("deve formatar preço corretamente para valores pequenos", () => {
      const cheapHotel = {
        ...mockHotel,
        pricePerNight: 50,
      };

      const wrapper = mount(HotelCard, {
        props: {
          hotel: cheapHotel,
        },
      });

      expect(wrapper.text()).toContain("50");
    });
  });

  describe("Watchers", () => {
    it("deve atualizar isSelected quando prop selected muda", async () => {
      const wrapper = mount(HotelCard, {
        props: {
          hotel: mockHotel,
          showCompareCheckbox: true,
          selected: false,
        },
      });

      await wrapper.setProps({ selected: true });
      await wrapper.vm.$nextTick();

      const checkbox = wrapper.find('input[type="checkbox"]')
        .element as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });
  });
});
