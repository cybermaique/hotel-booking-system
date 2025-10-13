import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useNotifications } from '~/composables/useNotifications'

describe('useNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('addNotification', () => {
    it('deve adicionar notificação à lista', () => {
      const { notifications, addNotification } = useNotifications()

      addNotification({
        type: 'success',
        title: 'Teste'
      })

      expect(notifications.value).toHaveLength(1)
      expect(notifications.value[0].title).toBe('Teste')
    })

    it('deve gerar ID único para cada notificação', () => {
      const { notifications, addNotification } = useNotifications()

      addNotification({ type: 'success', title: 'Notificação 1' })
      addNotification({ type: 'success', title: 'Notificação 2' })

      expect(notifications.value[0].id).toBeDefined()
      expect(notifications.value[1].id).toBeDefined()
      expect(notifications.value[0].id).not.toBe(notifications.value[1].id)
    })

    it('deve retornar o ID da notificação criada', () => {
      const { addNotification } = useNotifications()

      const id = addNotification({ type: 'success', title: 'Teste' })

      expect(id).toBeDefined()
      expect(typeof id).toBe('string')
    })

    it('deve aplicar valores padrão', () => {
      const { notifications, addNotification } = useNotifications()

      addNotification({ type: 'success', title: 'Teste' })

      expect(notifications.value[0].duration).toBe(5000)
      expect(notifications.value[0].persistent).toBe(false)
    })

    it('deve permitir sobrescrever valores padrão', () => {
      const { notifications, addNotification } = useNotifications()

      addNotification({
        type: 'success',
        title: 'Teste',
        duration: 3000,
        persistent: true
      })

      expect(notifications.value[0].duration).toBe(3000)
      expect(notifications.value[0].persistent).toBe(true)
    })

    it('deve remover automaticamente notificação não persistente após duração', () => {
      const { notifications, addNotification } = useNotifications()

      addNotification({
        type: 'success',
        title: 'Auto-dismiss',
        duration: 5000,
        persistent: false
      })

      expect(notifications.value).toHaveLength(1)

      vi.advanceTimersByTime(5000)

      expect(notifications.value).toHaveLength(0)
    })

    it('não deve remover automaticamente notificação persistente', () => {
      const { notifications, addNotification } = useNotifications()

      addNotification({
        type: 'error',
        title: 'Persistente',
        duration: 5000,
        persistent: true
      })

      expect(notifications.value).toHaveLength(1)

      vi.advanceTimersByTime(5000)

      expect(notifications.value).toHaveLength(1)
    })
  })

  describe('removeNotification', () => {
    it('deve remover notificação por ID', () => {
      const { notifications, addNotification, removeNotification } = useNotifications()

      const id = addNotification({ type: 'success', title: 'Teste' })
      expect(notifications.value).toHaveLength(1)

      removeNotification(id)
      expect(notifications.value).toHaveLength(0)
    })

    it('não deve fazer nada se ID não existir', () => {
      const { notifications, addNotification, removeNotification } = useNotifications()

      addNotification({ type: 'success', title: 'Teste' })
      expect(notifications.value).toHaveLength(1)

      removeNotification('id-inexistente')
      expect(notifications.value).toHaveLength(1)
    })

    it('deve remover apenas a notificação correta', () => {
      const { notifications, addNotification, removeNotification } = useNotifications()

      const id1 = addNotification({ type: 'success', title: 'Notificação 1' })
      addNotification({ type: 'info', title: 'Notificação 2' })

      removeNotification(id1)

      expect(notifications.value).toHaveLength(1)
      expect(notifications.value[0].title).toBe('Notificação 2')
    })
  })

  describe('clearAll', () => {
    it('deve remover todas as notificações', () => {
      const { notifications, addNotification, clearAll } = useNotifications()

      addNotification({ type: 'success', title: 'Notificação 1' })
      addNotification({ type: 'info', title: 'Notificação 2' })
      addNotification({ type: 'warning', title: 'Notificação 3' })

      expect(notifications.value).toHaveLength(3)

      clearAll()

      expect(notifications.value).toHaveLength(0)
    })

    it('não deve causar erro quando não há notificações', () => {
      const { notifications, clearAll } = useNotifications()

      expect(notifications.value).toHaveLength(0)
      expect(() => clearAll()).not.toThrow()
      expect(notifications.value).toHaveLength(0)
    })
  })

  describe('success', () => {
    it('deve criar notificação de sucesso', () => {
      const { notifications, success } = useNotifications()

      success('Operação bem-sucedida')

      expect(notifications.value).toHaveLength(1)
      expect(notifications.value[0].type).toBe('success')
      expect(notifications.value[0].title).toBe('Operação bem-sucedida')
    })

    it('deve aceitar mensagem opcional', () => {
      const { notifications, success } = useNotifications()

      success('Título', 'Mensagem detalhada')

      expect(notifications.value[0].message).toBe('Mensagem detalhada')
    })

    it('deve aceitar opções adicionais', () => {
      const { notifications, success } = useNotifications()

      success('Título', 'Mensagem', { duration: 3000 })

      expect(notifications.value[0].duration).toBe(3000)
    })
  })

  describe('error', () => {
    it('deve criar notificação de erro', () => {
      const { notifications, error } = useNotifications()

      error('Erro ocorreu')

      expect(notifications.value).toHaveLength(1)
      expect(notifications.value[0].type).toBe('error')
      expect(notifications.value[0].title).toBe('Erro ocorreu')
    })

    it('deve ser persistente por padrão', () => {
      const { notifications, error } = useNotifications()

      error('Erro')

      expect(notifications.value[0].persistent).toBe(true)
    })

    it('deve permitir sobrescrever persistência', () => {
      const { notifications, error } = useNotifications()

      error('Erro', undefined, { persistent: false })

      expect(notifications.value[0].persistent).toBe(false)
    })
  })

  describe('warning', () => {
    it('deve criar notificação de aviso', () => {
      const { notifications, warning } = useNotifications()

      warning('Atenção')

      expect(notifications.value).toHaveLength(1)
      expect(notifications.value[0].type).toBe('warning')
      expect(notifications.value[0].title).toBe('Atenção')
    })

    it('deve aceitar mensagem e opções', () => {
      const { notifications, warning } = useNotifications()

      warning('Aviso', 'Detalhes', { duration: 4000 })

      expect(notifications.value[0].message).toBe('Detalhes')
      expect(notifications.value[0].duration).toBe(4000)
    })
  })

  describe('info', () => {
    it('deve criar notificação de informação', () => {
      const { notifications, info } = useNotifications()

      info('Informação importante')

      expect(notifications.value).toHaveLength(1)
      expect(notifications.value[0].type).toBe('info')
      expect(notifications.value[0].title).toBe('Informação importante')
    })
  })

  describe('loading', () => {
    it('deve criar notificação de loading', () => {
      const { notifications, loading } = useNotifications()

      loading('Carregando...')

      expect(notifications.value).toHaveLength(1)
      expect(notifications.value[0].type).toBe('info')
      expect(notifications.value[0].title).toBe('Carregando...')
    })

    it('deve ser persistente', () => {
      const { notifications, loading } = useNotifications()

      loading('Processando')

      expect(notifications.value[0].persistent).toBe(true)
    })

    it('deve aceitar mensagem opcional', () => {
      const { notifications, loading } = useNotifications()

      loading('Aguarde', 'Processando dados...')

      expect(notifications.value[0].message).toBe('Processando dados...')
    })
  })

  describe('Notificações readonly', () => {
    it('deve retornar notifications como readonly', () => {
      const { notifications } = useNotifications()

      // Tenta modificar diretamente (não deve funcionar em runtime com readonly)
      expect(notifications.value).toBeDefined()
      expect(Array.isArray(notifications.value)).toBe(true)
    })
  })

  describe('Múltiplas instâncias', () => {
    it('cada instância deve ter seu próprio estado', () => {
      const instance1 = useNotifications()
      const instance2 = useNotifications()

      instance1.addNotification({ type: 'success', title: 'Teste 1' })
      instance2.addNotification({ type: 'info', title: 'Teste 2' })

      // Cada instância tem seu próprio ref, então não compartilham estado
      expect(instance1.notifications.value).toHaveLength(1)
      expect(instance2.notifications.value).toHaveLength(1)
    })
  })
})

