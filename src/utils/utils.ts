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

  
  const numeralStr = numeral(Number(truncatedValue)).format('0.00a').toUpperCase()

  // 1.00M -> 1M
  // 1.90M -> 1.9M
  const hasUnit = /[KMBT]$/.test(numeralStr)
  
  if (hasUnit) {
    const unit = numeralStr.slice(-1)  // Get the unit
    const numberPart = numeralStr.slice(0, -1)  // Get the number part
    
    if (numberPart.endsWith('.00')) {
      return numberPart.replace('.00', '') + unit
    }
    
    if (numberPart.endsWith('0')) {
      return numberPart.replace(/0$/, '') + unit
    }
  } else {
    // Handle numbers without units (< 1000)
    if (numeralStr.endsWith('.00')) {
      return numeralStr.replace('.00', '')
    }
    
    if (numeralStr.endsWith('0')) {
      return numeralStr.replace(/0$/, '')
    }
  }


  return numeralStr
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

// page number processing, round to two decimal places, remove trailing zeros
export function formatAmount(amount: number | string, decimal: number = 2, round: Big.RoundingMode = Big.roundHalfUp) {
  const bigValue = new Big(amount).round(decimal, round);
  const formatted = bigValue.toFixed(decimal);
  
  return formatted.endsWith('.00') ? bigValue.toFixed(0)
       : formatted.endsWith('0') ? bigValue.toFixed(1)
       : formatted;
}

// number thousandth processing
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

// 0.0000012312140000 -> 0.0(3)1231214
export function priceFormat(price: string) {
  if (!price) return ''
  if (!price.includes('.')) {
    return price
  }

  // 0.100 -> 0.1
  price = Big(price).toFixed(10, Big.roundDown)
  price = price.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')

  const priceArr = price.split('.')
  const integer = priceArr[0]
  const decimal = priceArr[1]

  const decimalArr = decimal.split('')
  const firstNonZeroIndex = decimalArr.findIndex(char => char !== '0')
  const leadingZeros = firstNonZeroIndex

  if (leadingZeros <= 1) {
    return formatNumber(price)
  }

  if (leadingZeros === 2) {
    const remainingDecimals = decimal.slice(firstNonZeroIndex)
    return `${integer}.00${remainingDecimals}`
  }

  const remainingDecimals = decimal.slice(firstNonZeroIndex)
  return `${integer}.0(${leadingZeros-1})${remainingDecimals}`
  
}