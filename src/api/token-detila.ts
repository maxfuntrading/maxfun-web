import { CommentItemResponse, HolderDistributionItemResponse, TokenBaseInfoResponse, TokenKlineItemResponse, TradeLogItemResponse } from "@/pages/token-detail/types/response";
import request from "./request";

export const fetchBaseInfo = async (tokenAddress: string) => {
  return request<TokenBaseInfoResponse>({
    url: `/api/token/basic-info`,
    method: 'GET',
    params: {
      token_address: tokenAddress,
    },
  })
};

export const fetchKline = async (tokenAddress: string) => {
  return request<{list: TokenKlineItemResponse[]}>({
    url: `/api/token/detail/kline`,
    method: 'GET',
    params: {
      token_address: tokenAddress,
    },
  })
}

export const fetchCommentHistory = async (tokenAddress: string, page: number = 1, pageSize: number = 20) => {
  return request<{list: CommentItemResponse[], total: number}>({
    url: `/api/token/detail/comment-history`,
    method: 'GET',
    params: {
      token_address: tokenAddress,
      page,
      page_size: pageSize,
    },
  })
}

export const fetchTradeLog = async (tokenAddress: string, lastBlockNumber: number, lastTxnIndex: number, lastLogIndex: number, limit: number = 20) => {
  return request<{list: TradeLogItemResponse[],}>({
    url: `/api/token/detail/trade-log`,
    method: 'GET',
    params: {
      token_address: tokenAddress,
      last_block_number: lastBlockNumber,
      last_txn_index: lastTxnIndex,
      last_log_index: lastLogIndex,
      limit,
    },
  })
}

export const fetchHolderDistribution = async (tokenAddress: string, page: number = 1, pageSize: number = 20) => {
  return request<{list: HolderDistributionItemResponse[],}>({
    url: `/api/token/detail/holder-distribution`,
    method: 'GET',
    params: {
      token_address: tokenAddress,
      page,
      page_size: pageSize,
    },
  })
}