# React Boilerplate Kubernetes Cluster Install

This guide explains how to install and configure a kubernetes cluster with react-boilerplate, node, react, mongodb, redis, loadbalancing, and scalability.

## Prerequisites

- [Google Cloud Starter Tutorial](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/k8s-google-cloud-starter-tutorial.md)
- [Google Kubernetes Engine Starter Tutorial](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/k8s-google-kubernetes-starter-tutorial.md)
- [Mongo Kubernetes Install Guide](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/k8s-mongo-install-guide.md)
- [Redis Kubernetes Install Guide](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/k8s-redis-install-guide.md)

## Configure Environment

React Boilerplate needs a number of environment variables to start correctly. To read more about how get credentials for social media signin such as Google+, Twitter, Facebook, [see related documentation](https://github.com/hutchgrant/react-boilerplate/blob/master/docs/README_CONFIG.md).

From the Redis and Mongo database services we need an internal IP address as well as authorization credentials so that React Boilerplate can connect.

Edit and save [config/prod.env](https://raw.githubusercontent.com/hutchgrant/react-boilerplate/master/config/prod.env):

```
MONGO_URI=mongodb://mongo-user:mongo-password@mongo-svc-internal-ip/reactboiler
REDIS_URL=your-redis-svc-internal-ip
REDIS_PORT=6379
COOKIE_KEY=some-random-cookie-key
SESSION_KEY=some-random-session-key
TOKEN_SECRET=some-random-token-key
REDIRECT_DOMAIN=http://localhost:5000
SITE_NAME=react-boilerplate
GOOGLE_CLIENT_ID=some-google-id
GOOGLE_CLIENT_SECRET=some-google-secret
FACEBOOK_CLIENT_ID=some-facebook-id
FACEBOOK_CLIENT_SECRET=some-facebook-secret
TWITTER_CONSUMER_ID=some-twitter-id
TWITTER_CONSUMER_SECRET=some-twitter-secret

SMTP_EMAIL=youremail@gmail.com
SMTP_PASS=your-password
```

## Create Secret

Now with those environment variables we can create a secret which will be accessible to the react-boilerplate deployment. 'mysecret' is the default name

```bash
kubectl create secret generic mysecret --from-env-file=./config/prod.env
```

## Install Deployment and Service

Launch the React Boilerplate deployment on port 5000 and expose that port using a service

```bash
kubectl apply -f ./config/kubernetes/node.yaml
```

node.yaml:

```ruby
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: boilerplate-deployment
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: react-boilerplate
    spec:
      containers:
      - name: react-boilerplate
        image: hutchgrant/react-boilerplate:latest
        command: ['bash', '-c', 'npm run start']
        ports:
        - name: nodejs-port
          containerPort: 5000
        envFrom:
        - secretRef:
            name: mysecret
---
apiVersion: v1
kind: Service
metadata:
  name: boilerplate-service
  labels:
    app: react-boilerplate
spec:
  ports:
    - port: 80
      name: http
      targetPort: nodejs-port
  selector:
    app: react-boilerplate
```

## Verify Deployment

Check to see a react-deployment pod was created

```bash
kubectl get pods
```

if the pod's status is still "CreatingContainer" or 'Error' try running kubectl describe on that pod to see what it's doing. Keep in mind it will take a few minutes to initially download the container image.

```bash
kubectl describe pod boilerplate-deployment-6d9b744db5-gwmgv
```

If you can't figure out the error try debugging the logs

## View React Boilerplate Log

```bash
kubectl get pods
```

Copy the full pod name that has 'boilerplate-deployment' in its name.

```bash
kubectl logs kubectl logs boilerplate-deployment-6d9b744db5-gwmgv
```

Should result in:

```bash
> react-boilerplate@1.0.1 start /opt/app
> node index.js
```

If you see any error related to mongo, double check you've installed and configured the Mongo admin accounts correctly. Anything about Google OAuth make sure you've configured the Google+ API correctly, see [Configure Environment](#Configure-Environment) above.

Congratulations you successfully installed react boilerplate. But hold on, how do you view it? You'll need to forward your domain to an external nginx proxy that connects to an internal nginx ingress on your kubernetes cluster(guide coming soon). Also you may wish to use Google's built in LoadBalancer instead. The former way is cheaper but still needs an internal load balancer to scale and lacks features that Google's built in LoadBalancer has.
