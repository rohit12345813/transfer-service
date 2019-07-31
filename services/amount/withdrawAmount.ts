import axios from "axios";
import config from "../../config";
import MethodHelper from "../../helper";

interface IWithdrawAmountService {
  amount: number;
  sourceAccountNumber: string;
  email: string;
}

export default class WithdrawAmountService {

  public static async perform({amount, sourceAccountNumber, email}: IWithdrawAmountService) {
    console.log("WithdrawAmountService method called");

    const API_URL = `${config.get("accountService.url")}${config.get("accountService.withdrawAmountAPIPath")}`;

    // Calling Account Service API to Withdraw the ammount
    let responseData;
    try {
      responseData = await axios({
        data: {
          amount,
          email,
          sourceAccountNumber,
        },
        headers: {
          authorization: MethodHelper.getAuthToken(),
        },
        method: "post",
        url: API_URL,
      });
    } catch (e) {
      const errorText = e.response.data
                  || `Error occuring while withdrawing the amount from source account number ${sourceAccountNumber}`;
      console.error(`<=====Error while  calling the ${API_URL}=====>`, errorText);
      return [null, errorText];
    }

    console.log("WithdrawAmountService method finished");
    return  [responseData.data, null];
  }
}
