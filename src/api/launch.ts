import request from "./request"


export const fetchRaiseTokenPrice = async (token: string) => {
  return request({
    url: `/api/launcher/raised-token-price?raised_token=${token}`,
    method: 'GET',
  })
}

export interface LaunchTokenParams {
  name: string
  icon: string
  symbol: string
  description: string
  raised_token: string
  tag?: string
  website?: string
  twitter?: string
  telegram?: string
  total_supply?: number
  raised_amount?: number
  sale_ratio?: number
  reserved_ratio?: number
  pool_ratio?: number
  launch_ts?: number
}

export const fetchLaunchToken = async (data: LaunchTokenParams) => {
  return request<{id: string, signature: string}>({
    url: '/api/launcher/launch-token',
    method: 'POST',
    data,
  })
}