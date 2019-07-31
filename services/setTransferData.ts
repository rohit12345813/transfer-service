import of from "await-of";
import MethodHelper from "../helper";
import Cache from "./cache";

interface ITransferData {
  amount: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  email: string;
  status?: string;
  transferId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
