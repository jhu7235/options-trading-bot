import { IRobinhoodHistoricalsResponse, IHistoricalData } from "../robinhood/types/historicals.type";
import { IRobinhoodQuoteResponse } from "../robinhood/types/quote.type";


// interface IData {
//   timestamp: string;
//   historical: IHistoricalData;
// }



export class AnalyzeService {

  // /**
  //  * account for splits
  //  * NOTE: we can deprecate this. Robinhood now includes a lit field
  //  */
  // private accountForSplit(data: IData[]) {
  //   console.log('accountForSplit', data)
  //   const historicals = data.map(({ timestamp, historical }) => {
  //     const splitFactor = historical.adjusted / historical.close;
  //     const newData: IData = {
  //       timestamp,
  //       historical: {
  //         ...historical,
  //         high: historical.high * splitFactor,
  //         low: historical.low * splitFactor,
  //         open: historical.open * splitFactor,
  //         close: historical.close * splitFactor,
  //       }
  //     };
  //     return newData;
  //   });
  //   return historicals;
  // }



  // /**
  //  * Assume it's initially reverse sorted
  //  */
  // private static getSortedData(historicalsResponse: IRobinhoodHistoricalsResponse): IData[] {
  //   return Object.entries(historicalsResponse.historicals).reverse()
  //     .map(([t, d]) => ({ timestamp: t, historical: d }));
  // }

  private static average(v1: number, v2: number) {
    return (v1 + v2) / 2;
  }

  private static normalChange(initial:number, final:number) {
    return (final-initial) / initial
  }


  /**
   * Find the current value from peak
   * TODO: unit test
   * @param lookBackPeriod in days
   */
  static findDipPercent(
    historicalsRes: IRobinhoodHistoricalsResponse, quoteRes: IRobinhoodQuoteResponse, lookBackPeriod: number) {
    // TODO: account for splits and look back on a certain interval
    let maxHistorical = {high_price: -Infinity} as IHistoricalData;
    historicalsRes.historicals.forEach(h => {
      if (h.high_price > maxHistorical.high_price) {
        maxHistorical = h;
      }
    })
    const quotePrice = this.average(quoteRes.results[0].ask_price,quoteRes.results[0].bid_price);
    const percentDip = this.normalChange(maxHistorical.high_price, quotePrice);
    return percentDip;
  }
}
