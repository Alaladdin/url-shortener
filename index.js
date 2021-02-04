const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const cors = require('cors');
const mongoose = require('mongoose');
const route = require('./app/routes/ShortenerRoute.js');

const app = express();
const PORT = process.env.PORT || 3000;

const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests',
});

require('dotenv').config();

app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');

app.use(express.static('vendor'));
app.use(express.json({ limit: '1kb' }));
app.use(limit);
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());
// app.use(cors()); // if u want to enable CORS
app.use('', route);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('connected to mongo database'))
  .catch((e) => console.error(e));

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
