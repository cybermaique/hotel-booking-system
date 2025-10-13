import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from '~/layers/design-system/components/atoms/Select.vue'

describe('Select', () => {
  const mockOptions = [
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' },
    { value: '3', label: 'Opção 3' }
  ]

  describe('Renderização básica', () => {
    it('deve renderizar corretamente', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions
        }
      })

      expect(wrapper.find('select').exists()).toBe(true)
    })

    it('deve renderizar label quando fornecido', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          label: 'Selecione uma opção'
        }
      })

      expect(wrapper.find('label').text()).toContain('Selecione uma opção')
    })

    it('deve renderizar placeholder quando fornecido', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          placeholder: 'Escolha...'
        }
      })

      const placeholderOption = wrapper.find('option[disabled]')
      expect(placeholderOption.exists()).toBe(true)
      expect(placeholderOption.text()).toBe('Escolha...')
    })

    it('deve renderizar todas as opções', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions
        }
      })

      const options = wrapper.findAll('option')
      // Não conta o placeholder pois não foi fornecido
      expect(options.length).toBe(3)
    })

    it('deve renderizar asterisco quando required é true', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          label: 'Campo obrigatório',
          required: true
        }
      })

      expect(wrapper.find('.text-red-500').text()).toBe('*')
    })
  })

  describe('Valores e v-model', () => {
    it('deve aceitar modelValue inicial', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '2'
        }
      })

      expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('2')
    })

    it('deve emitir update:modelValue quando o valor muda', async () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          modelValue: '1'
        }
      })

      await wrapper.find('select').setValue('3')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['3'])
    })

    it('deve suportar valores numéricos', () => {
      const numericOptions = [
        { value: 1, label: 'Um' },
        { value: 2, label: 'Dois' }
      ]

      const wrapper = mount(Select, {
        props: {
          options: numericOptions,
          modelValue: 2
        }
      })

      expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('2')
    })
  })

  describe('Estados', () => {
    it('deve aplicar atributo disabled quando disabled é true', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          disabled: true
        }
      })

      expect(wrapper.find('select').attributes('disabled')).toBeDefined()
    })

    it('deve aplicar atributo required quando required é true', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          required: true
        }
      })

      expect(wrapper.find('select').attributes('required')).toBeDefined()
    })

    it('deve exibir mensagem de erro quando fornecida', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          error: 'Campo obrigatório'
        }
      })

      const errorMessage = wrapper.find('.text-red-600')
      expect(errorMessage.exists()).toBe(true)
      expect(errorMessage.text()).toBe('Campo obrigatório')
    })

    it('não deve exibir mensagem de erro quando não fornecida', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions
        }
      })

      expect(wrapper.find('.text-red-600').exists()).toBe(false)
    })
  })

  describe('Classes CSS', () => {
    it('deve aplicar classes de erro quando error está presente', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          error: 'Erro'
        }
      })

      const select = wrapper.find('select')
      expect(select.classes()).toContain('border-red-300')
      expect(select.classes()).toContain('text-red-900')
    })

    it('deve aplicar classes de disabled quando disabled é true', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          disabled: true
        }
      })

      const select = wrapper.find('select')
      expect(select.classes()).toContain('bg-gray-50')
      expect(select.classes()).toContain('cursor-not-allowed')
    })

    it('deve aplicar classes padrão quando não há erro nem disabled', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions
        }
      })

      const select = wrapper.find('select')
      expect(select.classes()).toContain('border-gray-300')
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter id único', () => {
      const wrapper1 = mount(Select, {
        props: { options: mockOptions }
      })
      const wrapper2 = mount(Select, {
        props: { options: mockOptions }
      })

      const id1 = wrapper1.find('select').attributes('id')
      const id2 = wrapper2.find('select').attributes('id')

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })

    it('deve associar label com select através do id', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          label: 'Meu Select'
        }
      })

      const selectId = wrapper.find('select').attributes('id')
      const labelFor = wrapper.find('label').attributes('for')

      expect(selectId).toBe(labelFor)
    })

    it('deve ter aria-describedby quando há erro', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          error: 'Erro de validação'
        }
      })

      const ariaDescribedby = wrapper.find('select').attributes('aria-describedby')
      expect(ariaDescribedby).toBeDefined()
      expect(ariaDescribedby).toContain('error')
    })

    it('deve combinar aria-describedby customizado com erro', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions,
          error: 'Erro',
          ariaDescribedby: 'custom-description'
        }
      })

      const ariaDescribedby = wrapper.find('select').attributes('aria-describedby')
      expect(ariaDescribedby).toContain('error')
      expect(ariaDescribedby).toContain('custom-description')
    })
  })

  describe('Opções', () => {
    it('deve renderizar labels corretos para cada opção', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions
        }
      })

      const options = wrapper.findAll('option')
      expect(options[0].text()).toBe('Opção 1')
      expect(options[1].text()).toBe('Opção 2')
      expect(options[2].text()).toBe('Opção 3')
    })

    it('deve renderizar values corretos para cada opção', () => {
      const wrapper = mount(Select, {
        props: {
          options: mockOptions
        }
      })

      const options = wrapper.findAll('option')
      expect(options[0].attributes('value')).toBe('1')
      expect(options[1].attributes('value')).toBe('2')
      expect(options[2].attributes('value')).toBe('3')
    })

    it('deve lidar com lista vazia de opções', () => {
      const wrapper = mount(Select, {
        props: {
          options: []
        }
      })

      const options = wrapper.findAll('option')
      expect(options.length).toBe(0)
    })
  })
})

