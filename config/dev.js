module.exports = {
  mongoURI: 'mongodb://USER:PASSWORD@HOST/DATABASE',
  cookieKey: 'SOME_COOKIE_KEY',
  sessionKey: 'SOME_SESSION_KEY',
  tokenSecret: 'SOME_JWT_TOKEN_SECRET',
  redirectDomain: 'http://localhost:3000',
  sitename: 'YOURSITE.com',

  google: {
    recaptcha_secret: 'YOUR_RECAPTCHA_SERVER_SECRET',
    client_id: 'YOUR_GOOGLE+_CLIENT_ID',
    client_secret: 'YOUR_GOOGLE+_CLIENT_SECRET'
  },
  facebook: {
    client_id: 'YOUR_FB_APP_ID',
    client_secret: 'YOUR_FB_APP_SECRET'
  },
  twitter: {
    consumer_id: 'YOUR_TWITTER_CONSUMER_ID',
    consumer_secret: 'YOUR_TWITTER_CONSUMER_SECRET'
  },
  smtp: {
    email: 'YOUR_SMTP_EMAIL@SOMESITE.com',
    password: 'YOUR_SMTP_PASS'
  }
};
