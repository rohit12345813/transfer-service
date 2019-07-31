import MethodHelper from "../../helper";
import SetTransactionDataService from "../setTransactionData";
import ValidateWithdrawAmountService from "../validateWithdrawAmount";
import DepositAmountService from "./depositAmount";
import WithdrawAmountService from "./withdrawAmount";

interface ITransferAmountService {
  amount: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  email: string;
}

export default class TransferAmountService {

  public static async perform(data: ITransferAmountService) {
    console.log("TransferAmountService method called");
    // Validate Input Params
    const [, paramError] = this.checkParam(data);
    if (paramError) {
      return [null, paramError];
    }

    const {amount, sourceAccountNumber, destinationAccountNumber, email} = data;

    // Validate Withdraw Limit
    const [, limitReachedError] = await ValidateWithdrawAmountService.perform({
      accountNumber: sourceAccountNumber,
      amount,
    });

    if (limitReachedError) {
      return [null, limitReachedError];
    }

    // Calling Account Service withdraw amount API using the WithdrawAmountService
    const [response, error1] = await WithdrawAmountService.perform({amount, sourceAccountNumber, email});

    if (error1) {
      return [null, error1];
    }

    const transactionId = MethodHelper.getUniqId();

    const [, err2] = await SetTransactionDataService.perform({
      accountNumber: sourceAccountNumber,
      amount,
      status: "PASSED",
      transactionId,
      type: "WITHDRAW",
    });

    if (err2) {
      return [null, err2];
    }

    // Calling Account Service deposit amount API using the DepositAmountService
    const [, error2] = await DepositAmountService.perform({amount, accountNumber: destinationAccountNumber});

    if (error2) {
      // Check if deposit limit exceed
      if (error2.message.depositLimit) {
        const [, err3] = await SetTransactionDataService.perform({
          accountNumber: destinationAccountNumber,
          amount,
          fromAccount: sourceAccountNumber,
          status: "FAILED",
          type: "DEPOSIT",
        });
        // If Cache failed to update the data
        if (err3) {
          console.log(`Internal Server Error: Failed to update DB!!`, err3);
          return [null, err3];
        }
        // Update the source account balance because deposit failed at destination end
        const [, error3] = await DepositAmountService.perform({amount, accountNumber: sourceAccountNumber});
        if (error3) {
          // Add transaction details
          const [, err4] = await SetTransactionDataService.perform({
            accountNumber: sourceAccountNumber,
            amount,
            description: "Failed transaction has been passed",
            referenceTransactionId: transactionId,
            status: "PASSED",
            type: "DEPOSIT",
          });
          if (err4) {
            console.log(`Internal Server Error: Failed to update DB!!`, err4);
            return [null, err4];
          }
        }
        return [null, error2];
      }
      // add transaction if amount has been successfully deposited to destination account number
      const [, err5] = await SetTransactionDataService.perform({
        accountNumber: destinationAccountNumber,
        amount,
        fromAccount: sourceAccountNumber,
        status: "PASSED",
        type: "DEPOSIT",
      });

      if (err5) {
        console.log(`Internal Server Error: Failed to update DB!!`, err5);
        return [null, err5];
      }

      console.log("TransferAmountService method finished");
      return  [{...response.data}, null];
    }
  }

  public static checkParam(data: ITransferAmountService) {
    const {amount, sourceAccountNumber, destinationAccountNumber, email} = data;
    if (!MethodHelper.isNumber(amount)) {
      return [null, "Field 'amount' should be an Number > 0!!"];
    }
    if (!MethodHelper.isString(sourceAccountNumber)) {
      return [null, "Field 'sourceAccountNumber' is required!!"];
    }
    if (!MethodHelper.isString(destinationAccountNumber)) {
      return [null, "Field 'destinationAccountNumber' is required!!"];
    }
    if (!MethodHelper.isString(email)) {
      return [null, "Field 'email' is invalid!!"];
    }
    return [true];
  }
}
