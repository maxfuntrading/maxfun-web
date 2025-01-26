export interface TokenKlineItem {
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

export interface CommentItem {
  id: number;
  user_address: string;
  user_avatar: string;
  comment: string;
  create_ts: number;
}