require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  port            : process.env.PORT || 3010,
  host            : process.env.HOST || '0.0.0.0',
  mongoUri        : isProd ? process.env.MONGO_URI : process.env.MONGO_URI_DEV,
  redisHost       : isProd ? process.env.REDIS_HOST : 'localhost',
  redisPort       : isProd ? process.env.REDIS_PORT : 6379,
  redisPass       : isProd ? process.env.REDIS_PASS : '',
  defaultCacheTime: 3600,
};
