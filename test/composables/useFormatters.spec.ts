import { describe, it, expect } from 'vitest'
import { useFormatters } from '../../composables/useFormatters'

describe('useFormatters', () => {
  describe('formatDate', () => {
    it('formata data no formato YYYY-MM-DD para dd/mm/yyyy', () => {
      const { formatDate } = useFormatters()
      const result = formatDate('2024-03-15')
      expect(result).toBe('15/03/2024')
    })

    it('formata data de início de ano corretamente', () => {
      const { formatDate } = useFormatters()
      const result = formatDate('2024-01-01')
      expect(result).toBe('01/01/2024')
    })

    it('formata data de fim de ano corretamente', () => {
      const { formatDate } = useFormatters()
      const result = formatDate('2024-12-31')
      expect(result).toBe('31/12/2024')
    })

    it('retorna string vazia quando recebe string vazia', () => {
      const { formatDate } = useFormatters()
      const result = formatDate('')
      expect(result).toBe('')
    })

    it('formata corretamente datas com dias de um dígito', () => {
      const { formatDate } = useFormatters()
      const result = formatDate('2024-05-05')
      expect(result).toBe('05/05/2024')
    })

    it('formata corretamente datas de anos diferentes', () => {
      const { formatDate } = useFormatters()
      const result = formatDate('2023-07-20')
      expect(result).toBe('20/07/2023')
    })

    it('formata corretamente datas de fevereiro', () => {
      const { formatDate } = useFormatters()
      const result = formatDate('2024-02-29')
      expect(result).toBe('29/02/2024')
    })

    it('formata corretamente datas de meses com 30 dias', () => {
      const { formatDate } = useFormatters()
      const result = formatDate('2024-04-30')
      expect(result).toBe('30/04/2024')
    })

    it('formata corretamente datas de meses com 31 dias', () => {
      const { formatDate } = useFormatters()
      const result = formatDate('2024-08-31')
      expect(result).toBe('31/08/2024')
    })
  })
})

