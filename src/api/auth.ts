import request from "./request"

export const fetchNonce = async () => {
  return request<{ nonce: string }>({
    url: '/api/auth/nonce',
    method: 'get',
  })
}


export const fetchLogin = async (message: string, signature: string) => {
  return request<{
    user_exists: boolean;
    auth_type:   string;
    auth_token:  string;
  }>({
    url: '/api/auth/verify',
    method: 'post',
    data: {
      message,
      signature,
    }
  })
}