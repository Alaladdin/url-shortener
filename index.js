require('dotenv').config();
require('./app/cache/setup');

const path = require('path');
const ms = require('ms');
const express = require('express');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const passport = require('./app/passport/setup');
const Routes = require('./app/routes/SetupRoutes');
const {
  isProd,
  port,
  maxRequests,
  sessionSecret,
  mongoURL,
} = require('./config');

const app = express();
const limit = rateLimit({
  max: maxRequests,
  windowMs: ms('1h'),
  message: 'too many requests',
});

mongoose.set('useCreateIndex', true);

app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'vendor')));
app.use(express.json({ limit: '1kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(limit);
app.use(compression());
app.use(xss());
app.use(helmet());
app.use(mongoSanitize());
app.use(session({
  cookie: {
    expires: new Date(Date.now() + ms('30 days')),
    secure: true,
  },
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: mongoURL }),
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('', Routes);
app.disable('x-powered-by');
app.enable('trust proxy');

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.info('connected to mongo database'))
  .catch(console.error);

if (isProd) {
  app.listen(port, () => console.info(`listening on port ${port}`));
} else {
  const https = require('https');
  const fs = require('fs');
  https.createServer({
    key: fs.readFileSync(path.join(__dirname, './ssl/localhost__key.pem')),
    cert: fs.readFileSync('./ssl/localhost.pem'),
  }, app)
    .listen(port, () => console.info(`listening on port ${port}`));
}
