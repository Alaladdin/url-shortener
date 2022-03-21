require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const { host, port, mongoUri } = require('./config');
const route = require('./app/routes');
const { client } = require('./app/setup/cache');

const app = express();

app.use(helmet());
app.use(compression({ level: 9 }));
app.disable('x-powered-by');
app.enable('trust proxy');
app.use('', route);

client.connect()
  .then(() => console.info('connected to REDIS'))
  .then(() => mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }))
  .then(() => console.info('connected to MONGO'))
  .then(() => app.listen(port, host))
  .then(() => {
    console.info(`listening ${host}:${port}`);
    process.send('ready');
  })
  .catch(console.error);
