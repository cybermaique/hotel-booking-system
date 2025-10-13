import { defineCustomElement } from 'vue'
import HotelCardWebComponent from '~/components/HotelCardWebComponent.vue'

export default defineNuxtPlugin(() => {
  // Cria o Custom Element a partir do componente Vue Wrapper
  const HotelCardCustomElement = defineCustomElement(HotelCardWebComponent)

  // Registra o Custom Element no navegador
  if (!customElements.get('hotel-card-wc')) {
    customElements.define('hotel-card-wc', HotelCardCustomElement)
  }
})

