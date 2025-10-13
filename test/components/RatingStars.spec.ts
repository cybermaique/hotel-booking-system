import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RatingStars from '../../layers/design-system/components/atoms/RatingStars.vue'

describe('RatingStars', () => {
  it('renderiza 5 estrelas', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 3.5
      }
    })
    
    const stars = wrapper.findAll('svg')
    expect(stars).toHaveLength(5)
  })

  it('exibe a avaliação numérica quando showRating é true', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 4.2,
        showRating: true
      }
    })
    
    expect(wrapper.text()).toContain('4.2')
  })

  it('não exibe a avaliação numérica quando showRating é false', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 4.2,
        showRating: false
      }
    })
    
    expect(wrapper.text()).not.toContain('4.2')
  })

  it('exibe o número de avaliações quando fornecido', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 4.5,
        reviewCount: 120
      }
    })
    
    expect(wrapper.text()).toContain('120 avaliações')
  })

  it('não exibe o número de avaliações quando não fornecido', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 4.5
      }
    })
    
    expect(wrapper.text()).not.toContain('avaliações')
  })

  it('aplica classe text-yellow-400 para estrelas preenchidas', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 3
      }
    })
    
    const stars = wrapper.findAll('svg')
    expect(stars[0].classes()).toContain('text-yellow-400')
    expect(stars[1].classes()).toContain('text-yellow-400')
    expect(stars[2].classes()).toContain('text-yellow-400')
  })

  it('aplica classe text-gray-300 para estrelas vazias', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 2
      }
    })
    
    const stars = wrapper.findAll('svg')
    expect(stars[3].classes()).toContain('text-gray-300')
    expect(stars[4].classes()).toContain('text-gray-300')
  })

  it('formata a avaliação com uma casa decimal', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 4.567,
        showRating: true
      }
    })
    
    expect(wrapper.text()).toContain('4.6')
  })

  it('possui aria-label descritivo para acessibilidade', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 3.5
      }
    })
    
    const container = wrapper.find('[aria-label]')
    expect(container.attributes('aria-label')).toBe('Avaliação: 3.5 de 5 estrelas')
  })

  it('renderiza corretamente com rating 0', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 0
      }
    })
    
    const stars = wrapper.findAll('svg')
    stars.forEach(star => {
      expect(star.classes()).toContain('text-gray-300')
    })
  })

  it('renderiza corretamente com rating 5', () => {
    const wrapper = mount(RatingStars, {
      props: {
        rating: 5
      }
    })
    
    const stars = wrapper.findAll('svg')
    stars.forEach(star => {
      expect(star.classes()).toContain('text-yellow-400')
    })
  })
})

