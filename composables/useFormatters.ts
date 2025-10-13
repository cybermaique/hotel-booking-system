export const useFormatters = () => {
  /**
   * Formata uma string de data (YYYY-MM-DD) para o formato local (dd/mm/yyyy).
   * @param dateString A string de data no formato YYYY-MM-DD.
   * @returns A data formatada.
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString + 'T00:00:00') // Adiciona T00:00:00 para evitar problemas de fuso horário
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)
    } catch (e) {
      console.error('Erro ao formatar data:', e)
      return dateString // Retorna a string original em caso de erro
    }
  }

  return {
    formatDate,
  }
}

