const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const session = require('express-session');

const helmet = require('helmet');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const requestIp = require('request-ip');
const flash = require('express-flash');
const keys = require('./config/keys');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

// In production use a different session store such as Redis
// see https://redis.io for install
if (process.env.NODE_ENV === 'production') {
  const redis = require('redis');
  const redisStore = require('connect-redis')(session);
  const client = redis.createClient();
  app.use(
    require('express-session')({
      secret: keys.sessionKey,
      store: new redisStore({
        host: 'redis',
        port: 6379,
        client: client,
        ttl: 86400
      }),
      resave: true,
      saveUninitialized: true
    })
  );
} else {
  /* Development session store only */
  app.use(
    session({
      secret: keys.sessionKey,
      resave: false,
      saveUninitialized: true
    })
  );
}

app.set('views', 'views');
app.set('view engine', '.hbs');

app.use(flash());
app.use(helmet());
app.use(requestIp.mw());
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/authRoutes'));
app.use('/healthz', function(req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send('I am happy and healthy\n');
});

// remove if scaling client on seperate server
app.use(express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
///

const PORT = process.env.PORT || 5000;
app.listen(PORT);
