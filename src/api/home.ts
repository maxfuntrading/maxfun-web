import request from "./request"

export interface Marquee {
  user_address:  string;
  trade_type:    number; // 0: buy, 1: sell
  token_address: string;
  amount:        string;
  icon:          string;
  symbol:        string;
  tag:           string;
}
export const fetchMarquee = async () => {
  return request<{list: Marquee[]}>({
    url: '/api/home/marquee',
    method: 'GET'
  })
}

export interface TokenListResponse {
  total: number;
  list: MaxFunToken[];
}
export interface MaxFunToken {
  token_address: string;
  icon:          string;
  tag:           string;
  user_address:  string;
  name:          string;
  symbol:        string;
  description:   string;
  market_cap:    string | null;
  bonding_curve: string | null;
  is_launched:   boolean;
  price_rate24h: string;
}
export interface FetchTokenListParams {
  keyword?: string,
  tag?: string,
  is_launched?: boolean,
  sort_by?: string,
  sort_order?: string,
  page?: number,
  page_size?: number
}
export const fetchTokenList = async (params: FetchTokenListParams) => {
  return request<TokenListResponse>({
    url: '/api/home/token-list',
    method: 'GET',
    params,
  })
}