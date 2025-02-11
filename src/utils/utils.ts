import numeral from 'numeral'
import dayjs from "dayjs"
import { formatUnits } from 'viem'
import Big from 'big.js'

export function formatAddress(address: string, startLength: number = 6, endLength: number = 4) {
  if (!address) return ''
  return address.slice(0, startLength) + '...' + address.slice(-endLength)
}

export function formatNumber(number: number | string, decimalPlaces: number = 2) {
  if (number === undefined || number === null) return '';

  const num = new Big(number);
  const truncatedValue = num.round(decimalPlaces, Big.roundDown); // 截断（不四舍五入）

  const formatted = numeral(truncatedValue.toString()).format(`0.[${'0'.repeat(decimalPlaces)}]a`).toUpperCase();

  return formatted.replace(/\.?0*([KMBT])$/, '$1'); // 去掉无意义的 .0
}

export function copyText(text: string) {
  navigator.clipboard.writeText(text)
}

export function formatCommentDate(date: number) {
  if (!date) return ''

  const now = dayjs()
  const target = dayjs.unix(date)
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

export function bigintToAmount(num: bigint, decimal: number) {
  if (num === undefined || num === null || decimal === undefined || decimal === null) {
    return ''
  }

  return formatUnits(num, decimal)
}

export function formatAmount(amount: number | string, decimal: number = 2, round: Big.RoundingMode = Big.roundDown) {
  if (amount === undefined || amount === null || decimal === undefined || decimal === null) {
    return ''
  }

  return Big(amount).round(decimal, round).toFixed()
}

// 数字千分位处理
export function formatNumberLocale(num: number | string) {
  if (num === undefined || num === null) {
    return ''
  }

  if (typeof num === 'string') {
    num = parseFloat(num)
  }

  if (isNaN(num)) {
    return ''
  }
  
  // 将数字转换为字符串，以便计算小数位
  const numStr = num.toString();
  let fractionDigits = 0;
  if (numStr.includes('.')) {
    fractionDigits = numStr.split('.')[1].length;
  }

  return num.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}