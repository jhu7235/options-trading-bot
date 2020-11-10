import { firestore } from "../firebase/firebase";

interface IInstrumentList {
  list: string[];
}

export interface IInstrumentLists {
  [key: string]: IInstrumentList;
}

// db ref
// NOTE: not in class since can't be accessed from inside of static methods
const ref = firestore.collection("instrumentsLists");

// NOTE: not in class since can't be accessed from inside of static methods
function getDocRef(id: string) {
  return ref.doc(id);
}

/**
 * Wrapper class around instrumentsLists db collection
 */
export class InstrumentsLists {
  public list!: string[];

  constructor(fields:Partial<InstrumentsLists>) {
    Object.assign(this, fields);
  }
  /**
   * Gets all lists and convert it into a map
   */
  static getAll = async () => {
    const instrumentsLists: IInstrumentLists = {}
    const snap = await ref.get()
    snap.docs.forEach(instrumentList =>
      instrumentsLists[instrumentList.id] = instrumentList.data() as IInstrumentList
    )
    return instrumentsLists
  }

  /**
   * Updates or creates a travel regulation by country.
   */
  public update(id: string, data: Partial<IInstrumentList>) {
    return ref.doc(id).set(data);
  }

  /**
   * get list by id
   */
  static async get(id:string) {
    const entry = await getDocRef(id).get();
    return new InstrumentsLists(entry.data() as Partial<InstrumentsLists>);
  }

}
