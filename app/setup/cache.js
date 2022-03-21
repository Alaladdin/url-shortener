const mongoose = require('mongoose');
const redis = require('redis');
const { redisHost, redisPort, redisPass, defaultCacheTime } = require('../../config');

const client = redis.createClient({
  socket        : { host: redisHost, port: redisPort },
  password      : redisPass,
  retry_strategy: () => 2000,
});

const getCache = async (key, field) => {
  const value = await client.hGet(key, field || key);

  return JSON.parse(value);
};

const setCache = async (options = {}) => {
  const field = options.field || options.key;
  const value = JSON.stringify(options.value);

  await client.hSet(options.key, field, value);
  await client.expire(options.key, options.cacheTime || defaultCacheTime);
};

const clearCache = async (key, operation) => {
  const ignoredOperations = ['find', 'findById', 'findOne'];

  if (!ignoredOperations.includes(operation)) {
    const isCacheKeyExists = await client.exists(key);

    if (isCacheKeyExists)
      return client.del(key);
  }

  return null;
};

const { exec } = mongoose.Query.prototype;

mongoose.Query.prototype.exec = async function execute(...args) {
  const cacheKey = `database:${this.cacheKey || this.mongooseCollection.name}`;
  const queryOptions = this.getOptions();
  const needToClearCache = queryOptions.clearCache === undefined || queryOptions.clearCache;

  if (this.useCache || this.updateCache) {
    const cacheField = JSON.stringify({ operation: this.op, ...this.getFilter() });
    const cachedResult = await getCache(cacheKey, cacheField);

    if (!cachedResult || this.updateCache) {
      const databaseResult = await exec.apply(this, args);

      await setCache({
        key      : cacheKey,
        field    : cacheField,
        value    : databaseResult,
        cacheTime: this.cacheTime,
      });

      return databaseResult;
    }

    return cachedResult;
  }

  if (needToClearCache)
    await clearCache(cacheKey, this.op);

  return exec.apply(this, args);
};

mongoose.Query.prototype.cache = function cache(options = {}) {
  this.useCache = !options.suppressCache;
  this.updateCache = !!options.update;
  this.cacheKey = options.key;
  this.cacheTime = options.expires;

  return this;
};

module.exports = {
  client,
  getCache,
  setCache,
  clearCache,
};
