const mongoose = require('mongoose');
const cachegoose = require('cachegoose');
const { redisHost, redisPort, redisPass } = require('../../config');

cachegoose(mongoose, {
  engine: 'redis',
  host: redisHost,
  port: redisPort,
  password: redisPass,
});

const clearCache = (key, cb) => {
  if (!key) return console.error('[REDIS] key not provided to clear cache');
  return cachegoose.clearCache(key, cb);
};

module.exports = {
  clearCache,
};
