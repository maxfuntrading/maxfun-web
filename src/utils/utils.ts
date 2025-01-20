import numeral from 'numeral'
import dayjs from "dayjs"

export function formatAddress(address: string, startLength: number = 6, endLength: number = 4) {
  if (!address) return ''
  return address.slice(0, startLength) + '...' + address.slice(-endLength)
}

export function formatNumber(number: number) {
  if (number === undefined || number === null) return ''
  return numeral(number).format('0.00a').toUpperCase();
}

export function copyText(text: string) {
  navigator.clipboard.writeText(text)
}

export function formatCommentDate(date: number) {
  if (!date) return ''

  const now = dayjs()
  const target = dayjs(date)
  const diffInMinutes = now.diff(target, 'minute')
  const diffInHours = now.diff(target, 'hour')
  const diffInDays = now.diff(target, 'day')
  const diffInMonths = now.diff(target, 'month')
  const diffInYears = now.diff(target, 'year')

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`
  }

  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  }

  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  }

  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  }

  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
}
