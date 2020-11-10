export interface IRobinhoodHistoricalsResponse {
  quote: string; // url
  symbol: string;
  interval: string; // '5minute' | '10minute'
  span: string; // 'day' | 'week'
  bounds: string; // 'regular'
  instrument: string; // url
  historicals: IHistoricalData[];
  InstrumentID: string;
}

export interface IHistoricalData {
  begins_at: string; // iso Date string
  open_price: number;
  close_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  session: string; // 'reg'
  interpolated: boolean;
}

// custom interface
export interface IHistorical {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjusted?: number;
}


export type IInterval = '5minute' | '10minute';

export type ISpan = 'week' | 'day';
