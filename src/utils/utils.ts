export function formatAddress(address: string, startLength: number = 6, endLength: number = 4) {
  if (!address) return ''
  return address.slice(0, startLength) + '...' + address.slice(-endLength)
}
