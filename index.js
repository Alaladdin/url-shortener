require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const { port, mongoUri } = require('./config');
const route = require('./app/routes');

const app = express();

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
app.enable('trust proxy');
app.use('', route);

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.info('[MONGO] connected');

  app.listen(port, () => {
    console.info(`[APP] listening :${port}`);
    process.send('ready');
  });
});
