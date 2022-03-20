require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const cliParams = process.argv.slice(2);
const isDBProd = isProd || !cliParams.includes('--db-dev');

console.info(`[DATABASE] ${isDBProd ? 'PROD' : 'DEV'}`);

module.exports = {
  port     : process.env.PORT || 3010,
  host     : process.env.HOST || '127.0.0.1',
  mongoUri : isDBProd ? process.env.MONGO_URI : process.env.MONGO_URI_DEV,
  redisHost: isProd ? process.env.REDIS_HOST : 'localhost',
  redisPort: isProd ? process.env.REDIS_PORT : 6379,
  redisPass: isProd ? process.env.REDIS_PASS : '',
  cacheTime: 3600,
};
