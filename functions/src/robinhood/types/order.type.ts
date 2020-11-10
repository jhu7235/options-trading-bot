
export interface IRobinhoodOrdersResponse {
  next: string;
  previous: string;
  detail: string;
  results: IRobinhoodOrder[];
}

export interface IOrderResponse {
  next: string;
  previous: string;
  results: IOrder[];
}

interface IRobinhoodExecution {
  price: string; // string number
  quantity: string; // string number
  settlement_date: string; // 2020-04-06
  timestamp: string; // iso date string
  id: string;
}

interface IRobinhoodOrder {
  id: string;
  ref_id: string;
  url: string;
  account: string;
  position: string;
  cancel: null;
  instrument: string;
  cumulative_quantity: string;
  average_price: string;
  fees: string;
  state: string;
  type: string;
  side: string;
  time_in_force: string;
  trigger: string;
  price: string;
  stop_price: null;
  quantity: string; // string number
  reject_reason: null;
  created_at: string; // iso date string
  updated_at: string; // iso date string
  last_transaction_at: string; // iso date string
  executions: IRobinhoodExecution[];
  extended_hours: boolean;
  override_dtbp_checks: boolean;
  override_day_trade_checks: boolean;
  response_category: null;
  stop_triggered_at: null;
  last_trail_price: null;
  last_trail_price_updated_at: null;
  total_notional: {
    amount: number;
    currency_code: string,
    currency_id: string;
  };
  executed_notional: {
    amount: string, // number
    currency_code: string,
    currency_id: string;
  };
  investment_schedule_id: null;
}

export interface IOrder extends IRobinhoodOrder {
  symbol: string;
}
