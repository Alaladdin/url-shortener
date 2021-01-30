const express = require('express');
const mongoose = require('mongoose');
const route = require('./routes/ShortenerRoute.js');
const app = express();

const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.json());
app.use('', route);

mongoose
  .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
  .then(() => console.log('connected to mongo database'))
  .catch(e => console.error(e));

app.listen(PORT, () => console.log(`listening on port ${PORT}`));