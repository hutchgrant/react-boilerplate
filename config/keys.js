module.exports = {
  mongoURI: process.env.MONGO_URI,
  redis: {
    url: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
  },
  cookieKey: process.env.COOKIE_KEY,
  sessionKey: process.env.SESSION_KEY,
  tokenSecret: process.env.TOKEN_SECRET,
  redirectDomain: process.env.REDIRECT_DOMAIN,
  sitename: process.env.SITE_NAME,

  google: {
    recaptcha_secret: process.env.GOOGLE_RECAPTCHA_SECRET,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET
  },
  facebook: {
    client_id: process.env.FACEBOOK_CLIENT_ID,
    client_secret: process.env.FACEBOOK_CLIENT_SECRET
  },
  twitter: {
    consumer_id: process.env.TWITTER_CONSUMER_ID,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET
  },
  smtp: {
    email: process.env.SMTP_EMAIL,
    password: process.env.SMTP_PASS
  }
};
