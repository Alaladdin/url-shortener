require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const { host, port, mongoUri } = require('./config');
const route = require('./app/routes');

const app = express();

app.use(helmet());
app.use(compression({ level: 9 }));
app.disable('x-powered-by');
app.enable('trust proxy');
app.use('', route);

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.info('[MONGO] connected');

  app.listen(port, host);

  console.info(`[APP] listening ${host}:${port}`);
  process.send('ready');
});
