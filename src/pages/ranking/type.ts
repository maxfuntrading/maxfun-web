export interface RankingResponse {
  ranking_update_ts: number;
  list: RankingItem[];
}

export interface RankingItem {
  rank:          number;
  token_address: string;
  name:          string;
  symbol:        string;
  icon:          string;
  market_cap:    string;
  bonding_curve: string;
  price_rate24h: string;
  volume_24h:    string;
}

