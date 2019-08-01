import of from "await-of";
import NodeCache from "node-cache";
import config from "../config";
import {ICache} from "../interfaces";

const ttlSeconds: number = config.get("cacheTTL");

const Cache: ICache = {
  cacheInstance: null,

  setCache() {
    this.cacheInstance = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  },

  getCacheInstance() {
    return this.cacheInstance;
  },

  async getKey(key: string) {
    return new Promise((resolve, reject) => {
      this.cacheInstance.get(key, (err, value) => {
        if (!err) {
          resolve(value);
        } else {
          reject(err);
        }
      });
    });
  },

  async setKey(key: string, value: object) {
    return new Promise((resolve, reject) => {
      this.cacheInstance.set(key, value, (err) => {
        if (!err) {
          resolve(value);
        } else {
          reject(err);
        }
      });
    });
  },

  async getKeys() {
    return new Promise((resolve, reject) => {
      this.cacheInstance.keys((err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  },

  async getMultipleKeysWithValues(keys) {
    return new Promise((resolve, reject) => {
      this.cacheInstance.mget(keys, (err, res) => {
        if (!err) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    });
  },

  async isKeyValuePresent(key, value) {
    return new Promise(async (resolve, reject) => {
      const [keys, error1] = await of(Cache.getKeys());
      if (error1) {
        return reject(error1);
      }
      const [allData, error2] = await of(Cache.getMultipleKeysWithValues(keys));
      if (error2) {
        return reject(error2);
      }
      const AllKeys = Object.keys(allData);

      for (const data of AllKeys) {
        if (allData[data][key] === value) {
          return resolve(true);
        }
      }
      reject(false);
    });
  },

  async getAllData() {
    return new Promise(async (resolve, reject) => {
      const [keys, error1] = await of(Cache.getKeys());
      if (error1) {
        return reject(error1);
      }
      const [allData, error2] = await of(Cache.getMultipleKeysWithValues(keys));
      if (error2) {
        return reject(error2);
      }
      resolve(allData);
    });
  },
};

export default Cache;
