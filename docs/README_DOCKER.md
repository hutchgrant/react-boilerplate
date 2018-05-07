# React Boilerplate Docker Stack

## Prerequisites:

* [docker](https://www.docker.com/community-edition)
* [docker-compose](https://docs.docker.com/compose/install/)

```
git clone https://github.com/hutchgrant/react-boilerplate.git
cd react-boilerplate/docker
```

See [config documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_CONFIG.md) for information about setting up your environments.

The following will download and setup a cluster using react-boilerplate, nodejs, redis, mongo, containers. Using docker, it will launch all these containers, with react-boilerplate's node API being available on http://localhost:5000 and react-boilerplate's react frontend on http://localhost:3000

## Development

Development environment that includes monitors and hot loading.

```
docker-compose up
```

## Testing

Testing environment connects to a mongo database and then executes jest with puppeteer.

```
docker-compose -f docker-compose.testing.yml up
```

## Production

Production environment runs without monitors, hot loading, or any tests. It runs asset objects such as css/js/html/image files from the client/build directory directly to http://localhost:5000.

```
docker stack deploy -c docker-compose.prod.yml reactboiler
```
