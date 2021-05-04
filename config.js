require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  maxRequests: isProd ? 100 : 0,
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET,
  mongoURL: process.env.MONGO_URL,
  redisHost: isProd ? process.env.REDIS_HOST : 'localhost',
  redisPort: isProd ? process.env.REDIS_PORT : 6379,
  redisPass: process.env.REDIS_PASS,
  cacheTime: 3600,
};
