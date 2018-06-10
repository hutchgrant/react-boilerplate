# Mongo

- [Official MongoDB Google Cloud Launcher Image Documentation](https://github.com/GoogleCloudPlatform/mongodb-docker/blob/master/3/README.md)

## Quick Install

```bash
wget https://raw.githubusercontent.com/hutchgrant/react-boilerplate/master/config/kubernetes/redis/redis.yaml
kubectl apply -f redis.yaml
```

## Manual/Custom Install

### Create Namespace

It's easier if you keep utility applications in a seperate namespace called "main". Use the following template namespace.yaml

```
apiVersion: v1
kind: Namespace
metadata:
  name: main
```

### Create Deployment

Use the following template mongo-deploy.yaml to launch a mongo deployment with --auth argument.

```ruby
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: mongo
  namespace: main
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
      - image: launcher.gcr.io/google/mongodb3
        name: mongo
        volumeMounts:
          - name: data
            mountPath: /data/db
            subPath: data
        args:
          - '--auth'
        ports:
        - containerPort: 27017
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: data
```

### Create Persistent Volume Claim

Use the following template mongo-pvc.yaml

```ruby
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: data
  annotations:
    volume.alpha.kubernetes.io/storage-class: default
  namespace: main
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 5Gi
```

### Create Service

Use the following template mongo-svc.yaml

```ruby
apiVersion: v1
kind: Service
metadata:
  name: mongo
  labels:
    app: mongo
  namespace: main
spec:
  ports:
  - port: 27017
    protocol: TCP
  selector:
    app: mongo
```

### Add to Cluster

```sh
kubectl create -f namespace.yaml
kubectl create -f mongo-deploy.yaml
kubectl create -f mongo-pvc.yaml
kubectl create -f mongo-svc.yaml
```

## Configure

### Create Mongo Admin

Get the mongo pod name

```bash
kubectl get pods -n main | grep mongo
mongo-59d64b6bfd-58876   1/1       Running   0          1h
```

Execute bash on pod

```bash
kubectl exec -it mongo-59d64b6bfd-58876 -n main /bin/bash
root@mongo-59d64b6bfd-58876:/#
```

Open Mongo Client

```bash
root@mongo-59d64b6bfd-58876:/# mongo admin
MongoDB shell version v3.4.14
connecting to: mongodb://127.0.0.1:27017/admin
MongoDB server version: 3.4.14
```

Create Mongo User Administraitor

```json
db.createUser({
  "user" : "admin",
  "pwd" : "some-password",
  "roles" : [
    {
      "role" : "userAdminAnyDatabase",
      "db" : "admin"
    }
  ]
});
```

switch to the authentication database (in this case, admin), and use db.auth(<username>, <pwd>) method to authenticate:

```sh
use admin
db.auth("admin", "some-password" )
```

### Create additional user per deployment

```js
use react-boilerplate
db.createUser(
  {
    user: "some-username",
    pwd: "some-app-password",
    roles: [ { role: "readWrite", db: "react-boilerplate" },
             { role: "read", db: "react-boilerplate" } ]
  }
);
```

Get your Mongo Cluster IP:

```sh
kubectl get svc -n main | grep mongo
mongo     ClusterIP   10.11.250.248   <none>        27017/TCP   1h
```

Now you can login to mongo from any pod on the cluster by using

```sh
mongodb://some-username:some-password@your_mongo_cluster_ip_address/react-boilerplate
```

Congratulations you successfully installed mongo in a Kubernetes cluster.
