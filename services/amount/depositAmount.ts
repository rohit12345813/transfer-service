import of from "await-of";
import axios from "axios";
import config from "../../config";
import MethodHelper from "../../helper";

interface IDepositAmountService {
  amount: number;
  accountNumber: string;
}

export default class DepositAmountService {

  public static async perform({amount, accountNumber}: IDepositAmountService) {
    console.log("DepositAmountService method called");

    const API_URL = `${config.get("accountService.url")}${config.get("accountService.depositAmountAPIPath")}`;

    // Calling Account Service API to Deposit the ammount
    let responseData;
    try {
      responseData = await axios({
        data: {
          amount,
          destinationAccountNumber: accountNumber,
        },
        headers: {
          authorization: MethodHelper.getAuthToken(),
        },
        method: "post",
        url: API_URL,
      });
    } catch (e) {
      const errorText = e.response.data
                || `Error occuring while deposit the amount to destination account number ${accountNumber}`;
      console.error(`<=====Error while  calling the ${API_URL}=====>`, errorText);
      return [null, errorText];
    }

    console.log("DepositAmountService method finished");
    return  [responseData.data, null];
  }
}
