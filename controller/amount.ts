import of from "await-of";
import TransferAmountService from "../services/amount/transferAmount";
import SetTransferDataService from "../services/setTransferData";
import Cache from "../utils/cache";
import ResponseService from "../utils/response";

export default class AmountController {
  public static async transferAmount(req, res) {
    const date = new Date();
    const [transferId, transferError] = await SetTransferDataService.perform({...req.body, createdAt: date});
    if (transferError) {
      return ResponseService.operationFailed(res, transferError);
    }
    const [response, error] = await TransferAmountService.perform(req.body);
    await SetTransferDataService.perform({
      ...req.body,
      createdAt: date,
      status: error ? "FAILED" : "PASSED",
      transferId,
      updatedAt: new Date(),
    });
    const [allData] = await of(Cache.getAllData());
    console.log("all Data=======>", allData);
    if (error) {
      ResponseService.operationFailed(res, error);
    } else {
      ResponseService.success(res, response);
    }
  }
}
