# Production

React Boilerplate is meant primarily as a starter project, however if you
plan to put a modified version of this in production you will probably want to
use a better session store such as Redis. The default express-session store is
meant primarily for development.

You may also wish to create seperate configurations for production as each of
the APIs this software utilizes requires unique configurations for each
environment/domain. By default, the production configurations are located in
<strong>./config/prod.env</strong> when being run from a container. You'll need to add/edit those variables manually in your environment if you wish to use something else. <strong>./config/prod.local.env</storng> is the environment file used when not running in a container.
<strong>./config/shared.local.env</strong> is shared among all environments but can be overwritten by each environment.

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

See [Kubernetes Google Cloud Instructions](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_K8.md) for how to setup a cluster. Scale the number of nodes and replicas as you see fit(horizontally/vertically).

## SMTP

In production, you'll want to use a different email hosting provider. See [Nodemailer documentation](https://nodemailer.com/about/) for more information

Suggest you modify the <strong>./config/keys.js</strong> file to incorporate the following:

```
smtp: {
	host: process.env.SMTP_HOST,
	port:  process.env.SMTP_PORT,  
	secure: process.env.SMTP_SECURE,            // true for 465, false for other ports
	sender: process.env.SMTP_SENDER,  			// smtp sender email
	senderName: process.env.SMTP_SENDER_NAME,   // smtp sender name
    user: process.env.SMTP_USER,                // smtp account
    password: process.env.SMTP_PASSWORD         // smtp password
}
```

As well as modify your environment file <strong>./config/prod.env</strong> with:

```
SMTP_HOST=youremailhost
SMTP_PORT=587
SMTP_SECURE=true
SMTP_SENDER=some-person@someplace.com
SMTP_SENDER_NAME=some-person
SMTP_USER=some-account
SMTP_PASSWORD=somepassword
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
