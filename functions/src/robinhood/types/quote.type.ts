
export interface IRobinhoodQuoteResponse {
  results: IRobinhoodQuote[];
}

export interface IRobinhoodQuote {
  ask_price: number;
  ask_size: number;
  bid_price: number;
  bid_size: number;
  last_trade_price: number;
  last_extended_hours_trade_price: number;
  previous_close: number;
  adjusted_previous_close: number;
  previous_close_date: string; // date yyyy-mm-dd
  symbol: string;
  trading_halted: boolean;
  has_traded: boolean;
  last_trade_price_source: string; // 'consolidated'
  updated_at: string; // isoDateString
  instrument: string; // url
}
