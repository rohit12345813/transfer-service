import of from "await-of";
import moment from "moment";
import config from "../config";
import Cache from "./cache";

interface IWithdrawServiceParam {
  accountNumber: string;
  amount: number;
}

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
      console.log("createdAT", createdAt);
      console.log("isTodayTrnacsation", isTodayTransaction);

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
      return [null, "Sorry!! Transaction Per Day Limit Reached."];
    }

    console.log("ValidateWithdrawService method finished");
    return [true];
  }
}
