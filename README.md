# React Boilerplate

React Boilerplate with authentication, code-splitting,
Sass, Bootstrap, administration dashboard

<a href="https://github.com/hutchgrant/react-boilerplate/raw/master/docs/screenshots/screen_home.png"><img src="./docs/screenshots/screen_home.png" width="280px"></a>
<a href="https://github.com/hutchgrant/react-boilerplate/raw/master/docs/screenshots/screen_login.png"><img src="./docs/screenshots/screen_login.png" width="280px"></a>
<a href="https://github.com/hutchgrant/react-boilerplate/raw/master/docs/screenshots/screen_register.png"><img src="./docs/screenshots/screen_register.png" width="280px"></a>
<a href="https://github.com/hutchgrant/react-boilerplate/raw/master/docs/screenshots/screen_admin.png"><img src="./docs/screenshots/screen_admin.png" width="280px"></a>

## Docker Development

```
docker-compose up
```

See [docker stack config documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_DOCKER.md) for mongodb, session, cookie, social media(Google, Twitter,
Facebook) signin, recaptcha, API, additional configurations.

## Docker Testing

```
docker-compose -f docker-compose.testing.yml up
```

See [docker stack config documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_DOCKER.md) for mongodb, session, cookie, social media(Google, Twitter,
Facebook) signin, recaptcha, API, additional configurations.

## Docker Production

```
docker stack deploy -c docker-compose.prod.yml reactboiler
```

See [docker stack config documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_DOCKER.md) for mongodb, session, cookie, social media(Google, Twitter,
Facebook) signin, recaptcha, API, additional configurations.

## Local Installation

```
git clone https://github.com/hutchgrant/react-boilerplate.git
cd ./react-boilerplate
npm install && npm install --prefix client
```

## Configure

This software has some dependencies and requires initial configuration before it
can be run successfully.

See
[config documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_CONFIG.md) for mongodb, JWT, session, cookie, social media(Google, Twitter,
Facebook) signin, recaptcha, API, SMTP, configurations.

## Development

To start the environment in development mode:

```
npm run dev
```

This will launch the API on localhost:5000 and Client on localhost:3000
with monitors and hot loading.

## Testing

```
npm run build
npm run start-test
```

Then in a seperate shell

```
npm test
```

This will build then launch the API on localhost:5000 and Client on localhost:3000 using the ci.env environment. In your second window it will run all tests.

## Production

For information about running this software in a production environment, see
[production documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_PROD.md).

## License

React Boilerplate is available under the
[MIT License](https://github.com/hutchgrant/react-boilerplate/blob/master/LICENSE).

## Contributing

All contributions will be placed under the same MIT license, contributers must
agree to that license. For more information see
[contributing](https://github.com/hutchgrant/react-boilerplate/blob/master/CONTRIBUTING.md).

## Author

**Grant Hutchinson (hutchgrant)**
