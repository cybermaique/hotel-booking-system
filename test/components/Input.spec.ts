import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '../../layers/design-system/components/atoms/Input.vue'

describe('Input', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('exibe o label quando fornecido', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Nome'
      }
    })
    
    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.find('label').text()).toContain('Nome')
  })

  it('não exibe label quando não fornecido', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('exibe asterisco vermelho quando required é true', () => {
    const wrapper = mount(Input, {
      props: {
        label: 'Email',
        required: true
      }
    })
    
    const requiredSpan = wrapper.find('.text-red-500')
    expect(requiredSpan.exists()).toBe(true)
    expect(requiredSpan.text()).toBe('*')
  })

  it('aplica o placeholder corretamente', () => {
    const wrapper = mount(Input, {
      props: {
        placeholder: 'Digite seu nome'
      }
    })
    
    expect(wrapper.find('input').attributes('placeholder')).toBe('Digite seu nome')
  })

  it('aplica o type text por padrão', () => {
    const wrapper = mount(Input)
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('aplica o type email quando especificado', () => {
    const wrapper = mount(Input, {
      props: {
        type: 'email'
      }
    })
    
    expect(wrapper.find('input').attributes('type')).toBe('email')
  })

  it('aplica o type password quando especificado', () => {
    const wrapper = mount(Input, {
      props: {
        type: 'password'
      }
    })
    
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('emite update:modelValue ao digitar', async () => {
    const wrapper = mount(Input)
    const input = wrapper.find('input')
    
    await input.setValue('teste')
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['teste'])
  })

  it('exibe o valor inicial quando modelValue é fornecido', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'Valor inicial'
      }
    })
    
    expect(wrapper.find('input').element.value).toBe('Valor inicial')
  })

  it('desabilita o input quando disabled é true', () => {
    const wrapper = mount(Input, {
      props: {
        disabled: true
      }
    })
    
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('exibe mensagem de erro quando fornecida', () => {
    const wrapper = mount(Input, {
      props: {
        error: 'Campo obrigatório'
      }
    })
    
    const errorMsg = wrapper.find('.text-red-600')
    expect(errorMsg.exists()).toBe(true)
    expect(errorMsg.text()).toBe('Campo obrigatório')
  })

  it('aplica classes de erro quando error está presente', () => {
    const wrapper = mount(Input, {
      props: {
        error: 'Erro'
      }
    })
    
    expect(wrapper.find('input').classes()).toContain('border-red-300')
  })

  it('aplica classes de disabled quando disabled é true', () => {
    const wrapper = mount(Input, {
      props: {
        disabled: true
      }
    })
    
    expect(wrapper.find('input').classes()).toContain('bg-gray-50')
    expect(wrapper.find('input').classes()).toContain('cursor-not-allowed')
  })

  it('emite evento blur ao perder foco', async () => {
    const wrapper = mount(Input)
    const input = wrapper.find('input')
    
    await input.trigger('blur')
    
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('emite evento focus ao ganhar foco', async () => {
    const wrapper = mount(Input)
    const input = wrapper.find('input')
    
    await input.trigger('focus')
    
    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  it('aplica required ao input quando required é true', () => {
    const wrapper = mount(Input, {
      props: {
        required: true
      }
    })
    
    expect(wrapper.find('input').attributes('required')).toBeDefined()
  })

  it('aceita valores numéricos quando type é number', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'number',
        modelValue: 42
      }
    })
    
    expect(wrapper.find('input').element.value).toBe('42')
  })
})

