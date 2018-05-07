# Configuration

* [MongoDB](#mongo)
* [Redis](#redis)
* [API](#api)
* [Recaptcha](#recaptcha)
* [Passport](#passport)
* [Google+ SignIn](#google-signin)
* [Facebook SignIn](#facebook-signin)
* [Twitter SignIn](#twitter-signin)
* [SMTP](#smtp)
* [Nginx and LetsEncrypt](#nginx-and-letsencrypt)

<strong>Reminder</strong> in order to differentiate development and production keys this project requires configurations be placed in environment variables. For simplicity, all environment variables can be placed in <strong>./config/dev.env</strong> for development,<strong>./config/ci.env</strong> for testing<strong>, ./config/prod.env</strong> for production. <strong>Note:</strong> the .local. filename convention is for local installations made using git or compressed archive and are not being used in a kubernetes or docker-compose cluster. <strong>./config/shared.env</strong> is shared among all environments but can be overwritten by each specific environment.

## MongoDB

You'll need a mongo database to store your users etc. If you're using the docker-compose, it's installed and configured by default. Otherwise, you can find instructions to download it for windows/mac/linux at <a href="http://www.mongodb.com">mongodb.com</a> . If you don't want to install it on your local machine, you may opt to use a service such as <a href="http://www.mlab.com"> mlab.com</a>. You'll need to create a mongo user and database, then place your mongo URI into the API configuration file.

edit <strong>./config/dev.env</strong> with your mongo credentials

```
MONGO_URI=mongodb://mongo/reactboiler
```

Note: MONGO_URI is preset to the mongo container in project's docker-compose file by default, only edit this if you plan on using a different mongo database, perhaps on a different container.

## Redis

React Boilerplate uses redis for cache. It's included by defualt in the docker-compose file. If you're running on a local configuration you can find more info about [redis](https://redis.io/topics/quickstart) on their website.

## API

The API utilizes json web token based authentication and stores each user within a
session. You can create your own tokenSecret, cookieKey and sessionKey. The redirectDomain is
the location of the application itself(seperate from the API). By default the
API is on port 5000 and the application(redirectDomain) is on port 3000 of the
localhost. In production you should use https://yoursite.com

edit <strong>./config/dev.env</strong> with your API credentials

```
COOKIE_KEY=some-random-cookie-key
SESSION_KEY=some-random-session-key
TOKEN_SECRET=some-random-token-key
REDIRECT_DOMAIN=http://localhost:3000
SITE_NAME=react-boilerplate
```

## Recaptcha

Register a new site with [invisible recaptcha](https://www.google.com/recaptcha)

edit <strong>./config/dev.env</strong> with your google recaptcha credentials

```
GOOGLE_RECAPTCHA_SECRET=some-recaptcha-key
REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY=YourGoogleRecaptchaKey
```

## Passport

React-Boilerplate is currently using the passport strategies: Local Strategy, [Google OAuth2]((#google-signin), [facebook](#facebook-signin), [twitter](#twitter-signin).

To read more about these and additional passport strategies see
[Passportjs.org](http://www.passportjs.org)

## Google+ SignIn

You'll need developer API credentials for
[Google+](https://console.developers.google.com/).

Add a new project, add the Google+ API library, create OAuth2.0 credentials

Set Authorised JavaScript origins: http://localhost:5000

Set Authorised redirect URIs: http://localhost:3000/auth/google/callback

<strong>Reminder</strong> you'll need to set these URLs differently in
production for your domain. See
[production documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_PROD.md).

edit <strong>./config/dev.env</strong> with your google+ credentials

```
GOOGLE_CLIENT_ID=some-google-key
GOOGLE_CLIENT_SECRET=some-google-secret-key
```

## Facebook SignIn

You'll need developer API credentials for
[Facebook](https://developers.facebook.com/). Create an application, add
facebook SignIn.

edit <strong>./config/dev.env</strong> with your facebook credentials

```
FACEBOOK_CLIENT_ID=some-facebook-id
FACEBOOK_CLIENT_SECRET=some-facebook-secret
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

edit <strong>./config/dev.env</strong> with your twitter credentials

```
TWITTER_CONSUMER_ID=some-twitter-id
TWITTER_CONSUMER_SECRET=some-twitter-secret
```

<strong>Reminder</strong> in order to differentiate development and production keys, you'll need to set <strong>./config/prod.env</strong> with seperate keys for that environment

## SMTP

React Boilerplate uses nodemailer and by default we have it set to use a gmail account for development. In order to use [nodemailer with your gmail account](https://nodemailer.com/usage/using-gmail/) you need to enable "less secure" apps in gmail. You can enable it [here](https://myaccount.google.com/lesssecureapps).

edit <strong>./config/dev.env</strong> with your smtp credentials

```
SMTP_EMAIL=youremail@gmail.com
SMTP_PASS=your-password
```

## Nginx and LetsEncrypt

In <strong>production and staging/testing</strong>, it's assumed you will be using nginx and SSL sertificates. To configure nginx and generate a new lets encrypt ssl certificate for your domain while using the docker stack, edit the following env variables with your domain and your email address. You should keep the virtual_port the same unless you know what you're doing. Make sure you've already changed your domain's records to point to the server you're running this on, otherwise letsencrypt will not generate you a certificate.

Ignore this step in development, it won't do anything.

```
VIRTUAL_HOST=yoursite.com,www.yoursite.com
VIRTUAL_PORT=5000
LETSENCRYPT_HOST=yoursite.com,www.yoursite.com
LETSENCRYPT_EMAIL=youradmin@email.com
```
