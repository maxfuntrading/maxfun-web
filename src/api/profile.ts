import { TokenCreatedResponse, TokenOwnedResponse, UserInfoResponse } from "@/pages/profile/type";
import request from "./request";

export function fetchUserInfo() {
  return request<UserInfoResponse>({
    url: '/api/profile/userinfo',
    method: 'GET',
  })
}

export function fetchTokenOwned({keyword, page = 1, page_size = 20}: {keyword?: string, page?: number, page_size?: number}) {
  return request<TokenOwnedResponse>({
    url: '/api/profile/token-owned',
    method: 'GET',
    params: {
      ...(keyword && {keyword}),
      page,
      page_size,
    },
  })
}

export function fetchTokenCreated({keyword, page = 1, page_size = 20}: {keyword?: string, page?: number, page_size?: number}) {
  return request<TokenCreatedResponse>({
    url: '/api/profile/token-created',
    method: 'GET',
    params: {
      ...(keyword && {keyword}),
      page,
      page_size,
    },
  })
}