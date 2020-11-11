

export interface IOptionsChainParent {
  id: string;
  symbol: string;
  can_open_position: boolean;
  cash_component: null;
  expiration_dates: string[]; // format '2023-01-20'
  trade_value_multiplier: number;
  underlying_instruments: [
    {
      id: string;
      instrument: string; // url
      quantity: number // 100
    }
  ];
  min_ticks: {
    above_tick: number;
    below_tick: number;
    cutoff_price: number;
  }
}

export type TOptionType = 'call' | 'put';

export interface IOption {
  chain_id: string;
  chain_symbol: string;
  created_at: string; // date '2020-11-04T03:17:30.944110Z'
  expiration_date: string; // date '2020-11-13'
  id: string;
  issue_date: string; // date '1987-01-13'
  min_ticks: {
    above_tick: number;
    below_tick: number;
    cutoff_price: number
  };
  rhs_tradability: 'untradable' | 'tradable';
  state: 'active' | 'inactive';
  strike_price: number;
  tradability: 'untradable' | 'tradable';
  type: TOptionType;
  updated_at: string; // date '2020-11-04T03:17:30.944110Z'
  url: string; // url
  sellout_datetime: string; // date '2020-11-04T03:17:30.944110Z'
}

export interface IOptionChains {
  next: string; // url
  previous: string; // url
  results: IOption[];
}