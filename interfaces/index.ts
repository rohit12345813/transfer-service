export interface IMethodHelper {
  getAuthToken(): string;
  getUniqId(): string;
  isEmail(input: string): boolean;
  isString(input: string): boolean;
  isNumber(input: number): boolean;
}

export interface IData {
  amount: number;
  status: string;
  accountNumber: string;
  type: string;
  transactionId?: string;
  fromAccount?: string;
  description?: string;
  createAt?: Date;
  referenceTransactionId?: string;
}

export interface INewTransaction {
  amount: number;
  createdAt: Date;
  status: string;
  transactionId: string;
  type: string;
  fromAccount?: string;
  description?: string;
  referenceTransactionId?: string;
}

export interface ITransferAmountService {
  amount: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  email: string;
}

export interface IWithdrawAmountService {
  amount: number;
  sourceAccountNumber: string;
  email: string;
}

export interface IDepositAmountService {
  amount: number;
  accountNumber: string;
}

export interface ICache {
  cacheInstance: NodeCache | null;
  setCache(): void;
  getCacheInstance(): NodeCache;
  getKey(key: string): Promise<string>;
  setKey(key: string, value: object): Promise<object>;
  getKeys(): Promise<[string] | string>;
  getMultipleKeysWithValues(keys: [string]): Promise<object>;
  isKeyValuePresent(key: string, value: string): Promise<boolean>;
  getAllData(): Promise<{}>;
}

export interface IData  {
  data?: object | string;
  reason?: object | string;
}

export interface ITransferData {
  amount: number;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  email: string;
  status?: string;
  transferId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWithdrawServiceParam {
  accountNumber: string;
  amount: number;
}
