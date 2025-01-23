export enum SortType {
  LaunchedTime = "launch_ts",
  TradingVolume = "volume_rate24h",
  MarketCap = "market_cap",
  LastTrade = "last_trade",
}

export enum SortOrder {
  Ascending = "asc", // 升序: 小到大
  Descending = "desc", // 降序: 大到小
}
