# React Boilerplate

[![Build Status](https://travis-ci.org/hutchgrant/react-boilerplate.svg?branch=master)](https://travis-ci.org/hutchgrant/react-boilerplate)

React Boilerplate with authentication, code-splitting,
Sass, Bootstrap, administration dashboard

<a href="https://github.com/hutchgrant/react-boilerplate/raw/master/docs/screenshots/screen_home.png"><img src="./docs/screenshots/screen_home.png" width="280px"></a>
<a href="https://github.com/hutchgrant/react-boilerplate/raw/master/docs/screenshots/screen_login.png"><img src="./docs/screenshots/screen_login.png" width="280px"></a>
<a href="https://github.com/hutchgrant/react-boilerplate/raw/master/docs/screenshots/screen_register.png"><img src="./docs/screenshots/screen_register.png" width="280px"></a>
<a href="https://github.com/hutchgrant/react-boilerplate/raw/master/docs/screenshots/screen_admin.png"><img src="./docs/screenshots/screen_admin.png" width="280px"></a>

## Cluster Installation and Usage

### Kubernetes

See [kubernetes instructions](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_K8S.md) for how to setup a React Boilerplate, scalable, cluster, using Google Cloud, with all the prerequisite software installed and preconfigured.

### Docker

See [docker instructions](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_DOCKER.md) for how to use the React Boilerplate, Docker, Stack, with all the prerequisite software installed and preconfigured.

## Local Installation and Usage

Prerequisites:

- Mongo
- Redis

```
git clone https://github.com/hutchgrant/react-boilerplate.git
cd ./react-boilerplate
npm install && npm install --prefix client
```

### Configure

This software has some dependencies and requires initial configuration before it
can be run successfully.

See
[config documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_CONFIG.md) for mongodb, JWT, session, cookie, social media(Google, Twitter,
Facebook) signin, recaptcha, API, SMTP, configurations.

### Development

To start the environment in development mode:

```
npm run dev
```

This will launch the API on http://localhost:5000 and Client on http://localhost:3000
with monitors and hot loading.

### Testing

Testing environment connects to a mongo database and then executes jest with puppeteer.

```
npm run build
npm run start-test
```

Then in a seperate shell

```
npm test
```

### Production

For information about running this software in a production environment, see
[production documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_PROD.md).

---

## License

React Boilerplate is available under the
[MIT License](https://github.com/hutchgrant/react-boilerplate/blob/master/LICENSE).

## Contributing

All contributions will be placed under the same MIT license, contributers must
agree to that license. For more information see
[contributing](https://github.com/hutchgrant/react-boilerplate/blob/master/CONTRIBUTING.md).

## Author

**Grant Hutchinson (hutchgrant)**
