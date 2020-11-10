export interface IRobinhoodPositionResponse {
  next: string;
  previous: string;
  results: IRobinhoodPosition[];
}

export interface IPositionResponse {
  next: string;
  previous: string;
  results: IRobinhoodPosition[];
}

interface IRobinhoodPosition {
  url: string;
  instrument: string; // url
  account: string;
  account_number: string;
  average_buy_price: string;
  pending_average_buy_price: string;
  quantity: string;
  intraday_average_buy_price: string;
  intraday_quantity: string;
  shares_held_for_buys: string;
  shares_held_for_sells: string;
  shares_held_for_stock_grants: string;
  shares_held_for_options_collateral: string;
  shares_held_for_options_events: string;
  shares_pending_from_options_events: string;
  updated_at: string; // timestamp
  created_at: string; // timestamp
}

export interface IPosition extends IRobinhoodPosition {
  simple_name: string;
  symbol: string;
}
