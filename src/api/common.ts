import request from "./request"

export interface Tag {
  name: string
  sort: number
}

export const fetchTag = async () => {
  return request<{list: Tag[]}>({
    url: '/api/common/tag',
    method: 'GET'
  })
}

export const fetchUploadTokenIcon = async (data: FormData) => {
  return request<{url: string}>({
    url: '/api/common/upload-icon',
    method: 'POST',
    data
  })
}

export interface RaisedToken {
  address: string
  name: string
  symbol: string
  decimal: number
  icon: string
  price: string
}

export const fetchRaisedToken = async () => {
  return request<{list: RaisedToken[]}>({
    url: '/api/common/raised-token',
    method: 'GET'
  })
}