require('dotenv').config();
require('./app/cache/setup');

const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('./app/passport/setup');
const Routes = require('./app/routes/SetupRoutes');

const PORT = process.env.PORT || 3000;
const app = express();
const limit = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests',
});

mongoose.set('useCreateIndex', true);

app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'vendor')));
app.use(express.json({ limit: '1kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(limit);
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());
app.use(session({
  cookie: {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days in milliseconds
    secure: true,
  },
  proxy: true,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('', Routes);
app.disable('x-powered-by');

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongo database'))
  .catch((e) => console.error(e));

const https = require('https');
const fs = require('fs');
https.createServer({
  key: fs.readFileSync(path.join(__dirname, './ssl/localhost__key.pem')),
  cert: fs.readFileSync('./ssl/localhost.pem'),
}, app)
  .listen(PORT, () => console.log(`listening on port ${PORT}`));
