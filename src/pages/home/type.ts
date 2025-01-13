export enum TokenTag {
  All = "All",
  Infra = "Infra",
  Web3Game = "Web3 Game",
  AiGame = "Ai Game",
  AiAgent = "Ai Agent",
  IP = "IP",
  Esports = "Esports",
  Movies = "Movies",
}

export interface SelectOptionType<T> {
  key: T,
  value: string,
  icon?: string,
}

export enum SortType {
  LaunchedTime = "Launched Time",
  TradingVolume = "Trading Volume",
  MarketCap = "Market Cap",
  LastTrade = "Last Trade",
}