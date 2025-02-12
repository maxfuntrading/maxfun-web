import { MaxFunToken } from "@/api/home"

export interface UserInfoResponse {
  address: string
  name: string
  avatar: string
  create_ts: number
}

export interface TokenOwnedResponse {
  total: number
  list: TokenOwnedItem[]
}
export interface TokenOwnedItem {
  token_icon: string
  token_symbol: string
  quantity: string
  value: string
}

export interface TokenCreatedResponse {
  total: number
  list: MaxFunToken[]
}