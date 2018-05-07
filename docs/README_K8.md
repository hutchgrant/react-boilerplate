# Kubernetes Instructions

The following explains how to install and configure a kubernetes cluster with react-boilerplate, node, react, mongodb, redis, loadbalancing, and scalability.

## 1. Install and Init GCloud

* install gcloud sdk
* install kubectl
* download react-boilerplate:
```
git clone https://github.com/hutchgrant/react-boilerplate.git
cd ./react-boilerplate
```

Initialize Google Cloud SDK

```
gcloud init
```

* login
* select project / create new project

## 2. Create cluster

```
gcloud container clusters create react-boilerplate --num-nodes=2
```

## 3. Reserve static ip

Reserve static, global, IP, named node
```
gcloud compute addresses create node --global
```

## 4. Create secret for environment

```
cd ./config
nano prod.env
```

Edit with your production credentials. Save and then make a secret.

```
kubectl create secret generic mysecret --from-env-file=prod.env
```

## 5. Launch all deployments and services

```
cd ./kubernetes
kubectl create -f .
```

## SSL

First, you need to generate the certificate with certbot from letsencrypt.org. In order to do this, we'll need to prove to certbot that we own the domain. Normally you could just run certbot on the same server as nginx and it would automatically verify. Instead we're going to run it on our personal machine and then copy them to google's cloud console.

### Install certbot

```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
```

### Generate SSL certificate

Before you can validate, make sure you have your domain has the A record set to your load-balancer's external address.

```
sudo certbot certonly --standalone -d yoursite.com -d www.yoursite.com
```

### Validate Domain Ownership

Follow the directions. Make each requested file available at the path yoursite.com/.well-known/acme-challenge/somechallenge with the requested text content.
You can do this with our cluster by running:

```
kubectl get pods
```
To get a list of running pods, copy the container name then execute bash on boilerplate-deployment container

```
kubectl exec -it boilerplate-deployment-c559f57f9-59vvl /bin/bash
cd ./client/build
mkdir .well-known/acme-challenge -p
cd .well-known/acme-challenge
```

Then just output each to a file as requested:

```
echo 'dajkld3q88sd9q2dqd8asjdajds9a' > 'asdsadaskdajbdakbdjkbdkjawdjknsakda'
```

it should be now available at yoursite.com/.well-known/acme-challenge/asdsadaskdajbdakbdjkbdkjawdjknsakda

hit enter and repeat this task once more.

### Upload the certificate

For google cloud, you need to open google console, browse to Network Services -> Load Balancing. Click your loadbalancer, select 'edit' in your loadbalancer's details page. Now select Frontend configuration on the proceeding "Edit HTTP(S) load balancer" page.

* Click add "Frontend IP and port". Set Protocol HTTPS and port 443.
* Select "Create new certificate".
* Add a name: 'lets-encrypt'
* Upload public key certificate: fullchain.pem
* Upload Certificate chain Chain.pem
* Upload Private Key privKey.pem
* click "Create"
* click "Update"

### Persistant Storage

This requires a small bit of tweaking, but a production version of this should have persistant storage for mongo and redis. As well as s3 object storage for react-boilerplate's uploads.

### Database Authentication

You need to setup authentication with mongo by creating a new user with permissions to read/write your database. Run bash inside the mongo container add a new user. You should also add the argument '--auth' to the the mongo schema and then run:

```
kubectl apply -f mongo.yaml
```

## Specific Deployments and Services

If you need to modify the schema of a deployment or service, use one of the following:

Note: use create to <strong>add</strong> and use <strong>apply</strong> to update

## Add/update mongo deployment and service

```
kubectl create -f mongo.yaml

kubectl create -f mongo-service.yaml
```

## Add/update redis deployment and service

```
kubectl create -f redis.yaml

kubectl create -f redis-service.yaml
```

## Add/update node deployment and service

```
kubectl create -f node.yaml

kubectl create -f node-service.yaml
```

## Add/update ingress

```
kubectl create -f ingress.yaml
```
