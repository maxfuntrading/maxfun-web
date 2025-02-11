import { RankingResponse } from "@/pages/ranking/type"
import request from "./request"

export const fetchRankingProcess = async () => {
  return request<RankingResponse>({
    url: '/api/ranking/process',
    method: 'get',
  })
}

export const fetchRankingGainers = async () => {
  return request<RankingResponse>({
    url: '/api/ranking/gainer',
    method: 'get',
  })
}

export const fetchRankingMarketCap = async () => {
  return request<RankingResponse>({
    url: '/api/ranking/market-cap',
    method: 'get',
  })
}

export const fetchRankingVolume = async () => {
  return request<RankingResponse>({
    url: '/api/ranking/trading-volume',
    method: 'get',
  })
}
