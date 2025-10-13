import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../../layers/design-system/components/atoms/Button.vue'

describe('Button', () => {
  it('renderiza corretamente com conteúdo', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click Me'
      }
    })
    
    expect(wrapper.text()).toBe('Click Me')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('emite evento de click quando clicado', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click Me'
      }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.length).toBe(1)
  })

  it('não emite evento quando desabilitado', async () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled'
      }
    })
    
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('mostra indicador de loading quando loading é true', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'Loading'
      }
    })
    
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('desabilita o botão quando loading é true', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'Loading'
      }
    })
    
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('aplica variante primary por padrão', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Primary'
      }
    })
    
    expect(wrapper.classes()).toContain('bg-primary-500')
    expect(wrapper.classes()).toContain('text-white')
  })

  it('aplica variante secondary corretamente', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'secondary'
      },
      slots: {
        default: 'Secondary'
      }
    })
    
    expect(wrapper.classes()).toContain('bg-secondary-500')
  })

  it('aplica variante outline corretamente', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'outline'
      },
      slots: {
        default: 'Outline'
      }
    })
    
    expect(wrapper.classes()).toContain('border-2')
    expect(wrapper.classes()).toContain('border-gray-300')
  })

  it('aplica variante ghost corretamente', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'ghost'
      },
      slots: {
        default: 'Ghost'
      }
    })
    
    expect(wrapper.classes()).toContain('text-gray-700')
  })

  it('aplica tamanho small corretamente', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'sm'
      },
      slots: {
        default: 'Small'
      }
    })
    
    expect(wrapper.classes()).toContain('px-3')
    expect(wrapper.classes()).toContain('text-sm')
  })

  it('aplica tamanho large corretamente', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'lg'
      },
      slots: {
        default: 'Large'
      }
    })
    
    expect(wrapper.classes()).toContain('px-6')
    expect(wrapper.classes()).toContain('text-base')
  })

  it('aplica type submit quando especificado', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'submit'
      },
      slots: {
        default: 'Submit'
      }
    })
    
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('aplica type button por padrão', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Default'
      }
    })
    
    expect(wrapper.find('button').attributes('type')).toBe('button')
  })

  it('aplica rounded quando especificado', () => {
    const wrapper = mount(Button, {
      props: {
        rounded: true
      },
      slots: {
        default: 'Rounded'
      }
    })
    
    expect(wrapper.classes()).toContain('rounded-full')
  })

  it('aplica rounded-xl por padrão', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Default'
      }
    })
    
    expect(wrapper.classes()).toContain('rounded-xl')
  })

  it('aplica aria-describedby quando fornecido', () => {
    const wrapper = mount(Button, {
      props: {
        ariaDescribedby: 'description-id'
      },
      slots: {
        default: 'Accessible'
      }
    })
    
    expect(wrapper.find('button').attributes('aria-describedby')).toBe('description-id')
  })
})

