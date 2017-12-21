# Production

React Boilerplate is meant primarily as a starter project, however if you
plan to put a modified version of this in production you will probably want to
use a better session store such as Redis. The default express-session store is
meant primarily for development.

You may also wish to create seperate configurations for production as each of
the APIs this software utilizes requires unique configurations for each
environment/domain. By default, the production configurations are located in (
<strong>./config/prod.js</strong> ). You'll need to add those variables manually in your
environment if you wish to use something else.

You can build the client for production with

```
npm run build --prefix client
```

You can launch the API and Client with:

```
npm start
```

You can view it at http://localhost:5000

## Scaling

The API is deliberately kept seperate from the client renderer so if you wish
you can move and scale them on another server. If you do this, you'll need to
edit the configuration redirect and api domain properties.

edit <strong>./config/dev.js || ./config/prod.js</strong> with client credentials

```
redirectDomain: 'http://localhost:3000'
```

You will also need to edit the proxy in the Client

edit <strong>./src/package.json</strong> with the API credentials

```
  "proxy": {
    "/auth/*": {
      "target": "http://localhost:5000"
    },
    "/api/*": {
      "target": "http://localhost:5000"
    }
  },
```

## SMTP

In production, you'll want to use a different email hosting provider. See [Nodemailer documentation](https://nodemailer.com/about/) for more information

Suggest you modify the <strong>./config/prod.js</strong> with the following:

```
smtp: {
	host: 'SMTP.YOURHOST',
	port: 587,  
	secure: false,                           // true for 465, false for other ports
	sender: 'YOUR_SMTP_EMAIL@SOMESITE.com',  // smtp sender email
	senderName: 'YOUR_SMTP_CONTACT_NAME',    // smtp sender name
    user: 'YOUR_SMTP_USER',                  // smtp account
    password: 'YOUR_SMTP_PASS'               // smtp password
}
```

You will then need to uncomment <strong>./services/smtp/smtp.js</strong> line 16-22 with:

```
let transporter = nodemailer.createTransport({
	host: keys.smtp.host,
	port: keys.smtp.port,
	secure: keys.smtp.secure,
	auth: {
		user: keys.smtp.user,
		pass: keys.smtp.password
	}
});
```

As well you'll need to modify ln 27 and 46 to:

```
from: keys.smtp.senderName + " <" + keys.smtp.sender + ">",
```
