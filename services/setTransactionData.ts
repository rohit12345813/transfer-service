import of from "await-of";
import MethodHelper from "../helper";
import Cache from "./cache";

interface IData {
  amount: number;
  status: string;
  accountNumber: string;
  type: string;
  transactionId ?: string;
  fromAccount?: string;
  description?: string;
  createAt?: Date;
  referenceTransactionId?: string;
}

interface INewTransaction {
  amount: number;
  createdAt: Date;
  status: string;
  transactionId: string;
  type: string;
  fromAccount?: string;
  description?: string;
  referenceTransactionId?: string;
}

export default class SetTransactionService {

  public static async perform(data: IData) {
    console.log("SetTransactionService method called");

    const {amount, accountNumber, status, type} = data;
    const transactionId = data.transactionId || MethodHelper.getUniqId();
    // tslint:disable-next-line:prefer-const
    let [getKeyData, getKeyError] = await of(Cache.getKey(accountNumber));
    if (getKeyError) {
      return [null, getKeyError];
    }
    const newTransaction: INewTransaction = {
      amount,
      createdAt: new Date(),
      status,
      transactionId,
      type,
    };

    if (data.fromAccount) {
      newTransaction.fromAccount = data.fromAccount;
    }

    if (data.description) {
      newTransaction.description = data.description;
    }

    if (data.referenceTransactionId) {
      newTransaction.referenceTransactionId = data.referenceTransactionId;
    }

    if (getKeyData && getKeyData.length) {
      getKeyData.push(newTransaction);
    } else {
      getKeyData = [{...newTransaction}];
    }

    const [setKeyResponse, setKeyError] = await of(Cache.setKey(accountNumber, getKeyData));
    if (setKeyError) {
      return [null, setKeyError];
    }

    console.log("SetTransactionService method finished");
    return [setKeyResponse];

  }
}
