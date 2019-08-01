import of from "await-of";
import {ITransferData} from "../interfaces";
import Cache from "../utils/cache";
import MethodHelper from "../utils/helper";

export default class SetTransferDataService {

  public static async perform(transferData: ITransferData) {
    console.log("SetTransferDataService method called");
    const data = {
      status: transferData.status || "INITIATED",
      ...transferData,
    };

    const transferId = transferData.transferId || MethodHelper.getUniqId() + "transfer";

    const [, error] = await of(Cache.setKey(transferId, data));

    console.log("SetTransferDataService method finished");
    return  [transferId, error];
  }
}
