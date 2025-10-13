import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../../layers/design-system/components/atoms/Badge.vue'

describe('Badge', () => {
  it('renderiza corretamente com conteúdo padrão', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Test Badge'
      }
    })
    
    expect(wrapper.text()).toBe('Test Badge')
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('aplica a variante padrão quando não especificada', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Default'
      }
    })
    
    expect(wrapper.classes()).toContain('bg-gray-100')
    expect(wrapper.classes()).toContain('text-gray-800')
  })

  it('aplica a variante success corretamente', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'success'
      },
      slots: {
        default: 'Success'
      }
    })
    
    expect(wrapper.classes()).toContain('bg-green-100')
    expect(wrapper.classes()).toContain('text-green-800')
  })

  it('aplica a variante warning corretamente', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'warning'
      },
      slots: {
        default: 'Warning'
      }
    })
    
    expect(wrapper.classes()).toContain('bg-yellow-100')
    expect(wrapper.classes()).toContain('text-yellow-800')
  })

  it('aplica a variante error corretamente', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'error'
      },
      slots: {
        default: 'Error'
      }
    })
    
    expect(wrapper.classes()).toContain('bg-red-100')
    expect(wrapper.classes()).toContain('text-red-800')
  })

  it('aplica o tamanho small corretamente', () => {
    const wrapper = mount(Badge, {
      props: {
        size: 'sm'
      },
      slots: {
        default: 'Small'
      }
    })
    
    expect(wrapper.classes()).toContain('px-2')
    expect(wrapper.classes()).toContain('text-xs')
  })

  it('aplica o tamanho medium (padrão) corretamente', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Medium'
      }
    })
    
    expect(wrapper.classes()).toContain('px-2.5')
    expect(wrapper.classes()).toContain('text-sm')
  })

  it('aplica o tamanho large corretamente', () => {
    const wrapper = mount(Badge, {
      props: {
        size: 'lg'
      },
      slots: {
        default: 'Large'
      }
    })
    
    expect(wrapper.classes()).toContain('px-3')
    expect(wrapper.classes()).toContain('text-sm')
  })

  it('aplica classes base em todos os badges', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Test'
      }
    })
    
    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('items-center')
    expect(wrapper.classes()).toContain('font-medium')
    expect(wrapper.classes()).toContain('rounded-full')
  })

  it('combina variante e tamanho corretamente', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'info',
        size: 'lg'
      },
      slots: {
        default: 'Info Large'
      }
    })
    
    expect(wrapper.classes()).toContain('bg-blue-100')
    expect(wrapper.classes()).toContain('text-blue-800')
    expect(wrapper.classes()).toContain('px-3')
  })
})

