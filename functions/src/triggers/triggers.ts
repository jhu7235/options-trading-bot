import { InstrumentsLists } from "../collections/instrumentLists"
import robinhood from "../robinhood/robinhood";
import { AnalyzeService } from "../services/analyze.service";

const MY_LIST= 'fcVriOcbeU4JdlpAbTu9';

const openOptions = async () => {
   try {
      // get list
      const instrumentsList = await InstrumentsLists.get(MY_LIST);
      const instrumentId  = instrumentsList.list[0].toUpperCase();
      console.log({instrumentId});
      
      const [historicalRes, quoteRes] = await Promise.all([
         robinhood.getHistoricals(instrumentId,'10minute','week'),
         robinhood.getQuote(instrumentId)
      ]);
   
      // look back 90 days
      const percentDip  = AnalyzeService.findDipPercent(historicalRes, quoteRes,90);
      // if should open
      if(percentDip < -0.2) {
         //   get options cost
         //   find spread costs
         //   add spread to the list
      }
      // find optimal
      // TODO: define optimal
      // if optimal
      //   check of order already placed
      //   place order for 90 days
      console.log('done')
   } catch(error) {
      console.log(error);
   }
}
export {openOptions}