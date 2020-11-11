import fs from "fs";
import Robinhood, { RobinhoodWebApi } from "robinhood";
import { cbToPromise } from "../utils/cbToPromise";
import { IRobinhoodAccountsResponse } from "./types/account.type";
import { ICredentials } from "./types/credentials.type";
import { IInterval, IRobinhoodHistoricalsResponse, ISpan } from "./types/historicals.type";
import { IRobinhoodInstrument } from "./types/instrument.type";
import { IOptionChains, IOption, IOptionsChainParent, TOptionType } from "./types/option.type";
import { IOrder, IOrderResponse, IRobinhoodOrdersResponse } from "./types/order.type";
import { IPosition, IPositionResponse, IRobinhoodPositionResponse } from "./types/positions.type";
import { IRobinhoodQuoteResponse } from "./types/quote.type";
import { IRobinhoodUser } from "./types/user.type";

/**
 * Wrapper around robinhood npm library
 */
class RobinhoodWrapper {
  private robinhood!: RobinhoodWebApi;
  private initPromise!: Promise<any>;
  // instrument cache
  private instruments: { [instrumentId: string]: Promise<IRobinhoodInstrument> } = {};

  constructor() {
    this.sendCredentials();
  }

  /**
   * Get position with symbol
   */
  public async getPositions(): Promise<IPositionResponse> {
    await this.initPromise;
    const positionResponse: IRobinhoodPositionResponse = await this.httpGet(this.robinhood.positions);
    const promises = positionResponse.results.map(async (position): Promise<IPosition> => {
      const instrument = await this.getInstrument(position.instrument);
      return Object.assign({}, position, { symbol: instrument.symbol, simple_name: instrument.simple_name });
    });
    const positionsRes = Object.assign({}, positionResponse, { results: await Promise.all(promises) });
    this.coerceNumber(positionsRes);
    return positionsRes;
  }

  /**
   * Logs user into robinhood. Must happen before using library
   * returns logged in app and logged in data
   */
  public sendCredentials() {
    this.initPromise = new Promise((resolve) => {
      this.robinhood = Robinhood(this.getCredentials(), resolve);
    });
    // tslint:disable-next-line: no-floating-promises
    this.initPromise.then(() => console.log('Robinhood authenticated', ...arguments));
  }

  public async getUser(): Promise<IRobinhoodUser> {
    await this.initPromise;
    const response = await this.httpGet(this.robinhood.user);
    this.coerceNumber(response);
    return response as IRobinhoodUser;
  }

  public async getQuote(symbol: string): Promise<IRobinhoodQuoteResponse> {
    await this.initPromise;
    const response = await this.httpGet(this.robinhood.quote_data, symbol);
    this.coerceNumber(response);
    return response as IRobinhoodQuoteResponse;
  }

  public async getAccounts(): Promise<IRobinhoodAccountsResponse> {
    await this.initPromise;
    const response = await this.httpGet(this.robinhood.accounts);
    this.coerceNumber(response);
    return response as IRobinhoodAccountsResponse;
  }

  /**
   * Gets all the instruments for a user. Not used
   */
  public async getInstruments(): Promise<IRobinhoodInstrument[]> {
    await this.initPromise;
    await this.getOrders();
    return Promise.all(Object.values(this.instruments));
    // return this.httpGet(this.robinhood.instruments, null);
  }

  /**
   * Fetch instrument from Robinhood if it's not already in cache.
   * Then, cache result in memory.
   */
  public async getInstrument(instrumentUrl: string): Promise<IRobinhoodInstrument> {
    await this.initPromise;
    // check cache first
    if (!this.instruments[instrumentUrl]) {
      console.log('getting instrument', instrumentUrl)
      this.instruments[instrumentUrl] = this.httpGet<IRobinhoodInstrument>(this.robinhood.url, instrumentUrl)
        .then(async (instrument: IRobinhoodInstrument) => {
          instrument.fundamentals = await this.httpGet(this.robinhood.url, `${instrument.fundamentals}`);
          this.coerceNumber(instrument);
          return instrument;
        });
      console.log('fetching instrument', (await this.instruments[instrumentUrl]).symbol);
    } else {
      console.log('instrument in cache already', (await this.instruments[instrumentUrl]).symbol);
    }
    return this.instruments[instrumentUrl];
  }

  /**
   * Recursively gets orders and adds symbol
   */
  public async getOrders(nextUrl?: string): Promise<IOrderResponse> {
    await this.initPromise;
    const ordersResponse: IRobinhoodOrdersResponse = nextUrl
      ? await this.httpGet(this.robinhood.url, nextUrl)
      : await this.httpGet(this.robinhood.orders, null);

    const promises = ordersResponse.results.map(async (order): Promise<IOrder> => {
      const instrument = await this.getInstrument(order.instrument);
      return Object.assign({}, order, { symbol: instrument.symbol, simple_name: instrument.simple_name });
    });
    const nextResults = ordersResponse.next ? (await this.getOrders(ordersResponse.next)).results : [];
    const orderRes = Object.assign({}, ordersResponse, { results: [...await Promise.all(promises), ...nextResults] });
    this.coerceNumber(orderRes);
    return orderRes
  }

  public async getHistoricals(
    symbol: string,
    interval: IInterval,
    span: ISpan,
  ) {
    await this.initPromise;
    const response = await this.httpGet<IRobinhoodHistoricalsResponse>(
      this.robinhood.historicals,
      symbol,
      interval,
      span,
    );
    this.coerceNumber(response);
    return response;
  }

  /**
   * Get robinhood data via url
   */
  public getViaUrl(url: string) {
    return this.httpGet(this.robinhood.url, url);
  }

  /**
   * recursively mutates object so all number strings are coerced to number
   * TODO: unit test
   */
  private coerceNumber(parent: any, key?: number | string) {
    const child = key === undefined ? parent : parent[key];
    if (!child) {
      return;
    } else if (Array.isArray(child) || typeof child === 'object') {
      Object.keys(child).forEach(k => this.coerceNumber(child, k));
    } else {
      const forced = Number(child)
      if (!isNaN(forced)) {
        if (key === undefined) {
          throw new Error('no key');
        }
        parent[key] = forced;
      }
    }
  }

  /**
   * Gets option chains of a certain type (call/put) with expirations within a certain time frame
   * @param timeFrame start & end dates in ms
   */
  public async getOptionsChains(
    instrumentUrl: string,
    type: TOptionType,
    timeFrame?: { start: number, end: number }
  ) {
    console.log('getting options chains...')
    const instrument = await this.getInstrument(instrumentUrl);
    console.log('got instruments');
    const chainsParent = await this.getChainParent(instrument.tradable_chain_id);
    console.log('got chainsParent');
    const getChainPromises: Promise<IOption[]>[] = [];
    chainsParent.expiration_dates.forEach(d => {
      // NOTE: assumes server is running at NYC time or later.
      // NYSE options close at 5:30 (1 hr after market close)
      const expirationDate = new Date(d + 'T05:30:00').getTime(); // in ms
      if (!!timeFrame && timeFrame.start < expirationDate && timeFrame.end > expirationDate) {
        console.log('getting chain', instrument.symbol, d, type);
        getChainPromises.push(this.getChainByDate(chainsParent.id, d, type));
      } else if (!timeFrame) {
        getChainPromises.push(this.getChainByDate(chainsParent.id, d, type));
      }

    })
    const chains = await Promise.all(getChainPromises);
    console.log('got chains');
    return chains;
  }

  /**
   * Get the chain parent. It contains all the ids of all the options chains for 
   * different expiry dates
   */
  private async getChainParent(chainId: string): Promise<IOptionsChainParent> {
    const url = `https://api.robinhood.com/options/chains/${chainId}/`;
    return this.httpGet(this.robinhood.url, url);
  }

  /**
   * Gets the option chain for one expiry date
   * @param chainId 
   * @param expirationDate 
   * @param type 
   */
  public async getChainByDate(chainId: string, expirationDate: string, type: TOptionType) {
    const url = `https://api.robinhood.com/options/instruments/?chain_id=${chainId}&expiration_dates=${expirationDate}&state=active&type=${type}`
    return this.getChainByUrl(url);
  }

  /**
   * Gets and compile all the options for an option chain
   */
  private async getChainByUrl(url: string) {
    const chain = await this.httpGet<IOptionChains>(this.robinhood.url, url);
    if (chain.next) {
      const nextChain = await this.getChainByUrl(chain.next);
      chain.results.push(...nextChain);
    }
    return chain.results;

  }

  // TODO: move to ts decorator
  private async httpGet<T>(
    func: (...args: any[]) => void,
    ...parameters: any[]
  ): Promise<T> {
    const response = await cbToPromise(func, ...parameters);
    // error are stored in details
    if (response.detail) {
      throw new Error(response.detail);
    }
    return response;
  }

  /**
   * Gets credentials from local file
   */
  private getCredentials(): ICredentials {
    const data = fs.readFileSync("credentials.json", "utf8");
    return JSON.parse(data);
  }
}

/**
 * Return instantiated for now. Should use nextjs
 */
export default new RobinhoodWrapper();
