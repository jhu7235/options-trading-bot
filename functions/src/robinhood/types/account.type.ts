export interface IRobinhoodAccountsResponse {
  previous: string; // url
  results: IRobinhoodAccount[];
  next: string; // url
}

interface IRobinhoodAccount {
  deactivated: boolean;
  updated_at: string; // iso timestamp
  margin_balances: { [str: string]: any };
  portfolio: string; // url
  cash_balances: null;
  withdrawal_halted: boolean;
  cash_available_for_withdrawal: number;
  type: string;
  sma: number;
  sweep_enabled: boolean;
  deposit_halted: boolean;
  buying_power: number;
  user: string; // url
  max_ach_early_access_amount: number;
  cash_held_for_orders: number;
  only_position_closing_trades: boolean;
  rl: string; // url
  positions: string; // url
  created_at: string; // iso timestamp
  cash: number;
  sma_held_for_orders: number;
  account_number: number;
  uncleared_deposits: number;
  unsettled_funds: number;
}
