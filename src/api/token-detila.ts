import { CommentItem, TokenKlineItem } from "@/pages/token-detail/types";
import request from "./request";

export const fetchBaseInfo = async (tokenAddress: string) => {
  return request({
    url: `/api/token/basic-info`,
    method: 'GET',
    params: {
      token_address: tokenAddress,
    },
  })
};

export const fetchKline = async (tokenAddress: string) => {
  return request<{list: TokenKlineItem[]}>({
    url: `/api/token/detail/kline`,
    method: 'GET',
    params: {
      token_address: tokenAddress,
    },
  })
}

export const fetchCommentHistory = async (tokenAddress: string, page: number = 1, pageSize: number = 20) => {
  return request<{list: CommentItem[], total: number}>({
    url: `/api/token/detail/comment-history`,
    method: 'GET',
    params: {
      token_address: tokenAddress,
      page,
      page_size: pageSize,
    },
  })
}