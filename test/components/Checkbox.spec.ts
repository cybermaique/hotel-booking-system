import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from '../../layers/design-system/components/atoms/Checkbox.vue'

describe('Checkbox', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(Checkbox)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('exibe o label quando fornecido', () => {
    const wrapper = mount(Checkbox, {
      props: {
        label: 'Aceito os termos'
      }
    })
    
    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe('Aceito os termos')
  })

  it('não exibe label quando não fornecido', () => {
    const wrapper = mount(Checkbox)
    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('está desmarcado por padrão', () => {
    const wrapper = mount(Checkbox)
    const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('está marcado quando modelValue é true', () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: true
      }
    })
    
    const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('emite update:modelValue com true ao marcar', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false
      }
    })
    
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('emite update:modelValue com false ao desmarcar', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: true
      }
    })
    
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(false)
    
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('desabilita o checkbox quando disabled é true', () => {
    const wrapper = mount(Checkbox, {
      props: {
        disabled: true
      }
    })
    
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.attributes('disabled')).toBeDefined()
  })

  it('não desabilita o checkbox por padrão', () => {
    const wrapper = mount(Checkbox)
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.attributes('disabled')).toBeUndefined()
  })

  it('aplica classes corretas ao checkbox', () => {
    const wrapper = mount(Checkbox)
    const checkbox = wrapper.find('input[type="checkbox"]')
    
    expect(checkbox.classes()).toContain('h-4')
    expect(checkbox.classes()).toContain('w-4')
    expect(checkbox.classes()).toContain('text-primary-600')
    expect(checkbox.classes()).toContain('rounded')
  })

  it('label possui cursor pointer', () => {
    const wrapper = mount(Checkbox, {
      props: {
        label: 'Clique aqui'
      }
    })
    
    const label = wrapper.find('label')
    expect(label.classes()).toContain('cursor-pointer')
  })

  it('label está associado ao checkbox via for/id', () => {
    const wrapper = mount(Checkbox, {
      props: {
        label: 'Teste'
      }
    })
    
    const checkbox = wrapper.find('input[type="checkbox"]')
    const label = wrapper.find('label')
    
    expect(checkbox.attributes('id')).toBeTruthy()
    expect(label.attributes('for')).toBe(checkbox.attributes('id'))
  })

  it('aplica aria-describedby quando fornecido', () => {
    const wrapper = mount(Checkbox, {
      props: {
        ariaDescribedby: 'description-id'
      }
    })
    
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.attributes('aria-describedby')).toBe('description-id')
  })

  it('funciona com v-model (two-way binding)', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: false
      }
    })
    
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)
    
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })
})

