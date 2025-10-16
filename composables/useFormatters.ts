import dayjs from 'dayjs'

export const useFormatters = () => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    try {
      return dayjs(dateString, 'YYYY-MM-DD').format('DD/MM/YYYY')
    } catch (e) {
      console.error('Erro ao formatar data:', e)
      return dateString
    }
  }

  return {
    formatDate,
  }
}

