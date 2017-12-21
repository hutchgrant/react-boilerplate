# Configuration

* [MongoDB](#mongo)
* [API](#api)
* [Recaptcha](#recaptcha)
* [Google+ SignIn](#google-signin)
* [Facebook SignIn](#facebook-signin)
* [Twitter SignIn](#twitter-signin)
* [SMTP](#smtp)

## MongoDB

You'll need a mongo database to store your users etc. You can find instructions
to download it for windows/mac/linux at
<a href="http://www.mongodb.com">mongodb.com</a> . If you don't want to install
it on your local machine, you may opt to use a service such as
<a href="http://www.mlab.com"> mlab.com</a>. You'll need to create a mongo user and
database, then place your mongo URI into the API configuration file.

edit <strong>./config/dev.js</strong> with your mongo credentials

```
mongoURI: 'mongodb:/USER:PASS@HOST:PORT/DB_NAME',
```

<strong>Reminder</strong> you'll need to set this variable differently in
production. See
[production](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_PROD.md)
documentation

## API

The API utilizes json web token based authentication and stores each user within a
session. You can create your own tokenSecret, cookieKey and sessionKey. The redirectDomain is
the location of the application itself(seperate from the API). By default the
API is on port 5000 and the application(redirectDomain) is on port 3000 of the
localhost. It's setup this way so you can scale the API or the application
renderer seperately(with some slight modifications).

edit <strong>./config/dev.js</strong> with your API credentials

```
cookieKey: 'RABID_HONEY_BADGER',
sessionKey: 'MOOSE_RIOT',
tokenSecret: 'GOONS_UNDERRATED',
redirectDomain: 'http://localhost:3000',
sitename: 'YOURSITE.com'
```

## Recaptcha

Register a new site with [invisible recaptcha](https://www.google.com/recaptcha)

edit <strong>./config/dev.js</strong> with your google recaptcha credentials

```
  google: {
    recaptcha_secret: 'YOUR_RECAPTCHA_SERVER_SECRET',
  },
```

You also need to add a clientside key for the react application

edit <strong>./client/.env</strong> with your Recaptcha public credentials

```
REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY=YOUR_CLIENT_KEY
```

## Google+ SignIn

You'll need developer API credentials for
[Google+](https://console.developers.google.com/).

Add a new project, add the Google+ API library, create OAuth2.0 credentials

Set Authorised JavaScript origins: http://localhost:5000

Set Authorised redirect URIs: http://localhost:3000/auth/google/callback

<strong>Reminder</strong> you'll need to set these URLs differently in
production for your domain. See
[production documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_PROD.md).

edit <strong>./config/dev.js</strong> with your google+ credentials

```
  google: {
    client_id: 'YOUR_GOOGLE+_CLIENT_ID',
    client_secret: 'YOUR_GOOGLE+_CLIENT_SECRET'
  },
```

## Facebook SignIn

You'll need developer API credentials for
[Facebook](https://developers.facebook.com/). Create an application, add
facebook SignIn.

edit <strong>./config/dev.js</strong> with your facebook credentials

```
  facebook: {
    client_id: 'YOUR_FB_APP_ID',
    client_secret: 'YOUR_FB_APP_SECRET'
  },
```

## Twitter Signin

You'll need developer API credentials for [Twitter](https://apps.twitter.com/).

In the twitter app settings tab, set the twitter app callback URL:
<strong>http://localhost:5000/auth/twitter/callback</strong>

<strong>Reminder</strong> you'll need to set this URL differently in
production for your domain. See
[production documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_PROD.md).

In the twitter app permissions tab, check the box that says "request email
addresses from users" and then click the update settings button

edit <strong>./config/dev.js</strong> with your twitter credentials

```
  twitter: {
    consumer_id: 'YOUR_TWITTER_CONSUMER_ID',
    consumer_secret: 'YOUR_TWITTER_CONSUMER_SECRET'
  },
```

## SMTP

React Boilerplate uses nodemailer and by default we have it set to use a gmail account for development. In order to use [nodemailer with your gmail account](https://nodemailer.com/usage/using-gmail/) you need to enable "less secure" apps in gmail. You can enable it [here](https://myaccount.google.com/lesssecureapps).

edit <strong>./config/dev.js</strong> with your smtp credentials

```
  smtp: {
    email: 'YOUR_SMTP_EMAIL@gmail.com',
    password: 'YOUR_SMTP_PASS'
  }
```

<strong>Reminder</strong> you'll need to set this differently in
production for your email provider. See
[production documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_PROD.md).

You can add additional passport strategies see
[Passportjs.org](https://passportsjs.org)
