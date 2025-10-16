import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const useDateUtils = () => {
  const getTodayString = (): string => {
    return dayjs().format('YYYY-MM-DD')
  }

  const getTomorrowString = (): string => {
    return dayjs().add(1, 'day').format('YYYY-MM-DD')
  }

  const parseLocalDate = (dateStr: string): Date => {
    return dayjs(dateStr, 'YYYY-MM-DD').toDate()
  }

  const formatDate = (date: Date): string => {
    return dayjs(date).format('YYYY-MM-DD')
  }

  const addDays = (dateStr: string, days: number): string => {
    return dayjs(dateStr, 'YYYY-MM-DD').add(days, 'day').format('YYYY-MM-DD')
  }

  const diffInDays = (startStr: string, endStr: string): number => {
    const start = dayjs(startStr, 'YYYY-MM-DD')
    const end = dayjs(endStr, 'YYYY-MM-DD')
    return end.diff(start, 'day')
  }

  const isTodayOrFuture = (dateStr: string): boolean => {
    const date = dayjs(dateStr, 'YYYY-MM-DD')
    const today = dayjs().startOf('day')
    return date.isSame(today) || date.isAfter(today)
  }

  const isPast = (dateStr: string): boolean => {
    const date = dayjs(dateStr, 'YYYY-MM-DD')
    const today = dayjs().startOf('day')
    return date.isBefore(today)
  }

  const isBefore = (date1Str: string, date2Str: string): boolean => {
    const date1 = dayjs(date1Str, 'YYYY-MM-DD')
    const date2 = dayjs(date2Str, 'YYYY-MM-DD')
    return date1.isBefore(date2)
  }

  const isAfter = (date1Str: string, date2Str: string): boolean => {
    const date1 = dayjs(date1Str, 'YYYY-MM-DD')
    const date2 = dayjs(date2Str, 'YYYY-MM-DD')
    return date1.isAfter(date2)
  }

  const isSame = (date1Str: string, date2Str: string): boolean => {
    const date1 = dayjs(date1Str, 'YYYY-MM-DD')
    const date2 = dayjs(date2Str, 'YYYY-MM-DD')
    return date1.isSame(date2)
  }

  const getNextFriday = (): string => {
    const today = dayjs()
    const dayOfWeek = today.day()
    const daysUntilFriday = dayOfWeek === 5 ? 7 : (5 - dayOfWeek + 7) % 7 || 7
    return today.add(daysUntilFriday, 'day').format('YYYY-MM-DD')
  }

  const getNextSunday = (): string => {
    const friday = dayjs(getNextFriday(), 'YYYY-MM-DD')
    return friday.add(2, 'day').format('YYYY-MM-DD')
  }

  const getNextWeek = (): string => {
    return dayjs().add(7, 'day').format('YYYY-MM-DD')
  }

  const getNextWeekEnd = (): string => {
    return dayjs().add(9, 'day').format('YYYY-MM-DD')
  }

  const getNextMonth = (): string => {
    return dayjs().add(1, 'month').format('YYYY-MM-DD')
  }

  const getNextMonthEnd = (): string => {
    return dayjs().add(1, 'month').add(3, 'day').format('YYYY-MM-DD')
  }

  const addYears = (dateStr: string, years: number): string => {
    return dayjs(dateStr, 'YYYY-MM-DD').add(years, 'year').format('YYYY-MM-DD')
  }

  return {
    getTodayString,
    getTomorrowString,
    parseLocalDate,
    formatDate,
    addDays,
    diffInDays,
    isTodayOrFuture,
    isPast,
    isBefore,
    isAfter,
    isSame,
    getNextFriday,
    getNextSunday,
    getNextWeek,
    getNextWeekEnd,
    getNextMonth,
    getNextMonthEnd,
    addYears
  }
}

