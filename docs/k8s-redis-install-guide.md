# Redis Kubernetes Install

* [Official Redis Google Cloud Launcher Image Documentation](https://github.com/GoogleCloudPlatform/redis-docker/blob/master/3/README.md)

## Quick Install

```bash
wget https://raw.githubusercontent.com/hutchgrant/react-boilerplate/master/config/kubernetes/redis/redis.yaml
kubectl apply -f redis.yaml
```

## Custom Install

### Create Namespace

It's easier if you keep utility applications in a seperate namespace called "main".  Use the following template namespace.yaml

```ruby
apiVersion: v1
kind: Namespace
metadata:
  name: main
```

### Create Deployment

Use the following template redis-deploy.yml to launch a mongo deployment with --auth argument.
```ruby
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: redis
  namespace: main
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: launcher.gcr.io/google/redis3:latest
        ports:
        - containerPort: 6379
        volumeMounts:
        - mountPath: /data
          name: redis-data
      volumes:
        - name: redis-data
          persistentVolumeClaim:
            claimName: redis-data
```

### Create Persistent Volume Claim

Use the following template redis-pvc.yaml
```ruby
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: redis-data
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

Use the following template redis-svc.yaml
```ruby
apiVersion: v1
kind: Service
metadata:
  name: redis
  labels:
    app: redis
  namespace: main
spec:
  ports:
  - name: redis-port
    port: 6379
  selector:
    app: redis
```

### Add to Cluster

```sh
kubectl apply -f namespace.yaml
kubectl apply -f redis-deploy.yaml
kubectl apply -f redis-pvc.yaml
kubectl apply -f redis-svc.yaml
```

Congratulations you successfully installed Redis in a Kubernetes cluster.
