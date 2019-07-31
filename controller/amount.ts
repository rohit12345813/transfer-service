import of from "await-of";
import TransferAmountService from "../services/amount/transferAmount";
import Cache from "../services/cache";
import ResponseService from "../services/response";
import SetTransferDataService from "../services/setTransferData";

class AmountController {
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

export default AmountController;
