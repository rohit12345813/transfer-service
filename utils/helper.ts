import config from "../config";
import {IMethodHelper} from "../interfaces";

const methodHelper: IMethodHelper = {
  getAuthToken() {
    const username = config.get("accountService.userName");
    const password = config.get("accountService.password");
    return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  },

  getUniqId() {
    return (Math.floor(Math.random() * 90000) + 1000000000).toString();
  },

  isEmail(input)  {
    return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(input);
  },

  isString(input) {
    return !!(input && input.trim());
  },

  isNumber(input) {
    return ((!isNaN(input)) && input > 0);
  },

};

export default methodHelper;
