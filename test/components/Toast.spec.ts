import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Toast from '~/components/Toast.vue'

// Mock do composable useNotifications
const mockNotifications = ref<any[]>([])
const mockRemoveNotification = vi.fn()

// Definir mock global antes de importar o componente
global.useNotifications = vi.fn(() => ({
  notifications: mockNotifications,
  removeNotification: mockRemoveNotification
}))

describe('Toast', () => {
  beforeEach(() => {
    mockNotifications.value = []
    mockRemoveNotification.mockClear()
  })

  describe('Renderização básica', () => {
    it('deve renderizar sem notificações', () => {
      const wrapper = mount(Toast, {
        global: {
          stubs: {
            Teleport: true
          }
        }
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('deve renderizar notificação de sucesso', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'success',
        title: 'Sucesso!',
        message: 'Operação realizada com sucesso'
      }]

      const wrapper = mount(Toast, {
        global: { stubs: { Teleport: true } }
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Sucesso!')
      expect(wrapper.text()).toContain('Operação realizada com sucesso')
    })

    it('deve renderizar notificação de erro', async () => {
      mockNotifications.value = [{
        id: '2',
        type: 'error',
        title: 'Erro!',
        message: 'Algo deu errado'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Erro!')
      expect(wrapper.text()).toContain('Algo deu errado')
    })

    it('deve renderizar notificação de aviso', async () => {
      mockNotifications.value = [{
        id: '3',
        type: 'warning',
        title: 'Atenção!',
        message: 'Verifique os dados'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Atenção!')
      expect(wrapper.text()).toContain('Verifique os dados')
    })

    it('deve renderizar notificação de informação', async () => {
      mockNotifications.value = [{
        id: '4',
        type: 'info',
        title: 'Informação',
        message: 'Dados atualizados'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Informação')
      expect(wrapper.text()).toContain('Dados atualizados')
    })
  })

  describe('Múltiplas notificações', () => {
    it('deve renderizar múltiplas notificações', async () => {
      mockNotifications.value = [
        { id: '1', type: 'success', title: 'Sucesso 1' },
        { id: '2', type: 'error', title: 'Erro 1' },
        { id: '3', type: 'info', title: 'Info 1' }
      ]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Sucesso 1')
      expect(wrapper.text()).toContain('Erro 1')
      expect(wrapper.text()).toContain('Info 1')
    })
  })

  describe('Mensagem opcional', () => {
    it('deve renderizar apenas título quando não há mensagem', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'success',
        title: 'Apenas título'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Apenas título')
      const messageElements = wrapper.findAll('.mt-1.text-sm.opacity-90')
      expect(messageElements.length).toBe(0)
    })

    it('deve renderizar título e mensagem quando ambos estão presentes', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'success',
        title: 'Título',
        message: 'Mensagem detalhada'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toContain('Título')
      expect(wrapper.text()).toContain('Mensagem detalhada')
    })
  })

  describe('Botão de fechar', () => {
    it('deve ter botão de fechar em cada notificação', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'success',
        title: 'Teste'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const closeButton = wrapper.find('button')
      expect(closeButton.exists()).toBe(true)
    })

    it('deve chamar removeNotification ao clicar no botão de fechar', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'success',
        title: 'Teste'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const closeButton = wrapper.find('button')
      await closeButton.trigger('click')

      expect(mockRemoveNotification).toHaveBeenCalledWith('1')
    })
  })

  describe('Barra de progresso', () => {
    it('deve mostrar barra de progresso para notificações não persistentes com duração', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'success',
        title: 'Auto-dismiss',
        persistent: false,
        duration: 5000
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const progressBar = wrapper.find('.h-1.bg-current')
      expect(progressBar.exists()).toBe(true)
    })

    it('não deve mostrar barra de progresso para notificações persistentes', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'error',
        title: 'Persistente',
        persistent: true,
        duration: 5000
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const progressBar = wrapper.find('.h-1.bg-current')
      expect(progressBar.exists()).toBe(false)
    })

    it('não deve mostrar barra de progresso quando não há duração', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'info',
        title: 'Sem duração',
        persistent: false
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const progressBar = wrapper.find('.h-1.bg-current')
      expect(progressBar.exists()).toBe(false)
    })
  })

  describe('Classes CSS', () => {
    it('deve aplicar classes corretas para notificação de sucesso', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'success',
        title: 'Sucesso'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const notification = wrapper.find('.bg-green-50\\/95')
      expect(notification.exists()).toBe(true)
    })

    it('deve aplicar classes corretas para notificação de erro', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'error',
        title: 'Erro'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const notification = wrapper.find('.bg-red-50\\/95')
      expect(notification.exists()).toBe(true)
    })

    it('deve aplicar classes corretas para notificação de aviso', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'warning',
        title: 'Aviso'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const notification = wrapper.find('.bg-yellow-50\\/95')
      expect(notification.exists()).toBe(true)
    })

    it('deve aplicar classes corretas para notificação de informação', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'info',
        title: 'Info'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const notification = wrapper.find('.bg-blue-50\\/95')
      expect(notification.exists()).toBe(true)
    })
  })

  describe('Ícones', () => {
    it('deve renderizar ícone para cada notificação', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'success',
        title: 'Teste'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const icon = wrapper.find('.w-5.h-5')
      expect(icon.exists()).toBe(true)
    })

    it('deve renderizar ícones diferentes para tipos diferentes', async () => {
      mockNotifications.value = [
        { id: '1', type: 'success', title: 'Sucesso' },
        { id: '2', type: 'error', title: 'Erro' }
      ]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const icons = wrapper.findAll('.w-5.h-5')
      expect(icons.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter texto sr-only no botão de fechar', async () => {
      mockNotifications.value = [{
        id: '1',
        type: 'success',
        title: 'Teste'
      }]

      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      await wrapper.vm.$nextTick()

      const srOnly = wrapper.find('.sr-only')
      expect(srOnly.exists()).toBe(true)
      expect(srOnly.text()).toBe('Fechar')
    })
  })

  describe('Posicionamento', () => {
    it('deve ter classes de posicionamento fixo', () => {
      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      
      const container = wrapper.find('.fixed.top-4.right-4')
      expect(container.exists()).toBe(true)
    })

    it('deve ter z-index alto para ficar sobre outros elementos', () => {
      const wrapper = mount(Toast, { global: { stubs: { Teleport: true } } })
      
      const container = wrapper.find('.z-50')
      expect(container.exists()).toBe(true)
    })
  })
})

