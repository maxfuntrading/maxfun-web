import numeral from 'numeral'

export function formatAddress(address: string, startLength: number = 6, endLength: number = 4) {
  if (!address) return ''
  return address.slice(0, startLength) + '...' + address.slice(-endLength)
}

export function formatNumber(number: number) {
  if (number === undefined || number === null) return ''
  return numeral(number).format('0.00a').toUpperCase();
}