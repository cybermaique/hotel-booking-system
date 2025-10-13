import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HotelImageGallery from '../../components/HotelImageGallery.vue'

describe('HotelImageGallery', () => {
  const mockImages = [
    '/images/hotel_1.jpg',
    '/images/hotel_2.jpg',
    '/images/hotel_3.jpg'
  ]

  it('renderiza corretamente com imagens', () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: mockImages,
        hotelName: 'Hotel Test'
      }
    })
    
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('exibe a primeira imagem inicialmente', () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: mockImages,
        hotelName: 'Hotel Test'
      }
    })
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(mockImages[0])
  })

  it('exibe o alt text correto', () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: mockImages,
        hotelName: 'Hotel Test'
      }
    })
    
    const img = wrapper.find('img')
    expect(img.attributes('alt')).toBe('Imagem 1 de Hotel Test')
  })

  it('mostra botões de navegação quando há múltiplas imagens', () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: mockImages,
        hotelName: 'Hotel Test'
      }
    })
    
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
  })

  it('não mostra botões de navegação quando há apenas uma imagem', () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: ['/images/hotel_1.jpg'],
        hotelName: 'Hotel Test'
      }
    })
    
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(0)
  })

  it('avança para a próxima imagem ao clicar no botão next', async () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: mockImages,
        hotelName: 'Hotel Test'
      }
    })
    
    const buttons = wrapper.findAll('button')
    const nextButton = buttons[1]
    
    await nextButton.trigger('click')
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(mockImages[1])
  })

  it('volta para a imagem anterior ao clicar no botão prev', async () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: mockImages,
        hotelName: 'Hotel Test'
      }
    })
    
    const buttons = wrapper.findAll('button')
    const nextButton = buttons[1]
    const prevButton = buttons[0]
    
    await nextButton.trigger('click')
    await nextButton.trigger('click')
    await prevButton.trigger('click')
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(mockImages[1])
  })

  it('faz loop para a primeira imagem ao avançar da última', async () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: mockImages,
        hotelName: 'Hotel Test'
      }
    })
    
    const buttons = wrapper.findAll('button')
    const nextButton = buttons[1]
    
    await nextButton.trigger('click')
    await nextButton.trigger('click')
    await nextButton.trigger('click')
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(mockImages[0])
  })

  it('faz loop para a última imagem ao voltar da primeira', async () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: mockImages,
        hotelName: 'Hotel Test'
      }
    })
    
    const buttons = wrapper.findAll('button')
    const prevButton = buttons[0]
    
    await prevButton.trigger('click')
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(mockImages[2])
  })

  it('mostra indicadores de imagem quando há múltiplas imagens', () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: mockImages,
        hotelName: 'Hotel Test'
      }
    })
    
    const indicators = wrapper.findAll('.w-2.h-2.rounded-full')
    expect(indicators).toHaveLength(3)
  })

  it('não mostra indicadores quando há apenas uma imagem', () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: ['/images/hotel_1.jpg'],
        hotelName: 'Hotel Test'
      }
    })
    
    const indicators = wrapper.findAll('.w-2.h-2.rounded-full')
    expect(indicators).toHaveLength(0)
  })

  it('usa imagem placeholder quando array está vazio', () => {
    const wrapper = mount(HotelImageGallery, {
      props: {
        images: [],
        hotelName: 'Hotel Test'
      }
    })
    
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('/images/placeholder.png')
  })
})

