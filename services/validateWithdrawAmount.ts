import of from "await-of";
import moment from "moment";
import config from "../config";
import {IWithdrawServiceParam} from "../interfaces";
import Cache from "../utils/cache";

export default class ValidateWithdrawService {

  public static async perform({accountNumber, amount}: IWithdrawServiceParam) {
    console.log("ValidateWithdrawService method called");
    const [accountNumberTDetails, error] = await of(Cache.getKey(accountNumber));

    if (error) {
      return [null, "Error occuring while fetching the transaction details"];
    }

    if (!accountNumberTDetails) {
      return [true];
    }

    const startDate = moment().startOf("day");
    const endDate = moment();
    let totalAmount = amount;
    const transactionData = {};

    for (const transaction of accountNumberTDetails) {
      const createdAt = moment(transaction.createdAt);
      const isTodayTransaction = createdAt.isSameOrAfter(startDate)
                                  && createdAt.isSameOrBefore(endDate);

      if (transaction.referenceTransactionId === transactionData.hasOwnProperty(transaction.referenceTransactionId)) {
        totalAmount -= transaction.amount;
        continue;
      }

      const isWithDrawTransaction = transaction.type === "WITHDRAW" && transaction.status === "PASSED";

      if (isWithDrawTransaction && isTodayTransaction) {
        transactionData[`${transaction.transactionId}`] = true;
        totalAmount += transaction.amount;
      }
    }

    if (totalAmount > config.get("transactionAmountLimitPerDay")) {
      return [null, `Sorry!! Transaction Per Day Limit Reached. Please try amount below than ${amount}`];
    }

    console.log("ValidateWithdrawService method finished");
    return [true];
  }
}
