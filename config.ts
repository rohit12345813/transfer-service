import convict from "convict";

const config = convict({
  accountService: {
    depositAmountAPIPath: {
      default: "/api/account/deposit",
      doc: "Account service deposit api path",
      env: "ACCOUNT_SERVICE_DEPOSIT_API_PATH",
      format: String,
    },
    password: {
      default: "admin@#@$%!",
      doc: "Account service password",
      env: "ACCOUNT_SERVICE_PASSWORD",
      format: String,
    },
    url:  {
      default: "http://localhost:4000",
      doc: "URL of account service'",
      env: "ACCOUNT_SERVICE_URL",
      format: String,
    },
    userName: {
      default: "admin@transferService.com",
      doc: "Account service username",
      env: "ACCOUNT_SERVICE_USERNAME",
      format: String,
    },
    withdrawAmountAPIPath: {
      default: "/api/account/withdraw",
      doc: "Account service withdraw api path",
      env: "ACCOUNT_SERVICE_WITHDRAW_API_PATH",
      format: String,
    },
  },
  app: {
    name: {
      default: "Transfer Service",
      doc: "Service Name'",
      env: "APP_NAME",
      format: String,
    },
  },
  cacheTTL: {
    default: 60 * 60 * 1,
    doc: "TTL for node cache.",
    env: "CACHE_TTL",
    format: Number,
  },
  env: {
    default: "development",
    doc: "The application environment.",
    env: "NODE_ENV",
    format: ["production", "development", "staging", "test"],
  },
  port: {
    default: 5000,
    doc: "The port to bind.",
    env: "PORT",
    format: Number,
  },
  transactionAmountLimitPerDay: {
    default: 1000000,
    doc: "Transaction limit per day",
    env: "TRANSACTION_AMOUNT_LIMIT_PER_DAY",
    format: Number,
  },
});

config.validate({ allowed: "strict" });

export default config;
