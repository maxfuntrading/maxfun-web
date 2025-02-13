export interface TokenKlineItemResponse {
  open_ts: number;
  close_ts: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  amount: string;
  txn_num: number;
}

export interface CommentItemResponse {
  id: number;
  user_address: string;
  user_avatar: string;
  comment: string;
  create_ts: number;
}

// token base info
export interface TokenBaseInfoResponse {
  token_basic:  TokenBasic;
  raised_token: RaisedToken;
}
export interface RaisedToken {
  address: string;
  name:    string;
  symbol:  string;
  icon:    string;
  decimal: number;
}
export interface TokenBasic {
  name:          string;
  symbol:        string;
  icon:          string;
  description:   string;
  tag:           string;
  website:       string;
  twitter:       string;
  telegram:      string;
  total_supply:  string;
  price:         string;
  price_rate24h: string;
  market_cap:    string;
  liquidity:     string;
  volume24h:     string;
}

// trade log
export interface TradeLogResponse {
  token1_name: string;
  token2_name: string;
  list: TradeLogItemResponse[];
}
export interface TradeLogItemResponse {
  block_number:  number;
  txn_index:     number;
  log_index:     number;
  user_address:  string;
  trade_type:    number;
  token1_amount: string;
  token2_amount: string;
  block_time:    number;
  txn_hash:      string;
}

// holder distribution
export interface HolderDistributionResponse {
  total_holders: number;
  list: HolderDistributionItemResponse[];
}

export interface HolderDistributionItemResponse {
  user_address: string;
  amount: string;
  percentage: string;
}

