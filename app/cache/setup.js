const mongoose = require('mongoose');
const cachegoose = require('cachegoose');

cachegoose(mongoose, {
  engine: 'redis',
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
});

const clearCache = (key, cb) => {
  if (!key) return console.error('[REDIS] key not provided to clear cache');
  return cachegoose.clearCache(key, cb);
};

module.exports = {
  clearCache,
};
