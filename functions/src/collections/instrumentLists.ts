import { firestore } from "../firebase/firebase";

interface IInstrumentList {
  list: string[];
}

export interface IInstrumentLists {
  [key: string]: IInstrumentList;
}

/**
 * Wrapper class around instrumentsLists db collection
 */
export class InstrumentsLists {
  // db ref
  private ref = firestore.collection("instrumentsLists");

  /**
   * Gets all lists and convert it into a map
   */
  public getAll = async () => {
    const instrumentsLists: IInstrumentLists = {}
    const snap = await this.ref.get()
    snap.docs.forEach(instrumentList =>
      instrumentsLists[instrumentList.id] = instrumentList.data() as IInstrumentList
    )
    return instrumentsLists
  }

  /**
   * Updates or creates a travel regulation by country.
   */
  public update(id: string, data: Partial<IInstrumentList>) {
    return this.ref.doc(id).set(data);
  }

  /**
   * get list by id
   */
  public async get(id:string) {
    const entry= await this.getDocRef(id).get();
    return entry.data();
  }

  public getDocRef(id: string) {
    return this.ref.doc(id);
  }
}
