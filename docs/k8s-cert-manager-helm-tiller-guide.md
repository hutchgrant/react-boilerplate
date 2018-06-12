# cert-manager kubernetes guide

[Official Documentation](http://docs.cert-manager.io)

You have a few options for installation of cert-manager. You can install using helm which is a package manager for kubernetes or you can install using the provided deploy templates with or without RBAC.

Once installed, you can create a issuer (e.g. LetsEncrypt) and certificate resources for your domains.

## Option 1: Install with RBAC

```bash
kubectl apply config/kubernetes/cert-manager/deploy/rbac/.
```

## Option 2: Helm Install

[Official Helm Install Documentation](https://github.com/kubernetes/helm/blob/master/docs/install.md#installing-tiller)

Helm is a package manager for kubernetes and can make it easy to install applications in your cluster.

Install Helm locally first:

```bash
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh
```

To install Tiller on your kubernetes cluster using helm:

```bash
helm init
```

To use helm to install charts(applications), you'll need a service account binded to a cluster-admin role. You can add that by using the included tiller yaml templates which will create the account and update the tiller deployment:

```bash
kubectl apply -f config/kubernetes/tiller/.
```

Now you can install cert-manager with:

```bash
 helm install --name cert-manager stable/cert-manager
```

## Create Issuer for LetsEncrypt

edit config/kubernetes/cert-manager/issuer.yaml and add your email address

```ruby
apiVersion: certmanager.k8s.io/v1alpha1
kind: Issuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    # The ACME server URL
    server: https://acme-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration
    email: youremail@yoursite.com
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt-prod-key
    # Enable HTTP01 validations
    http01: {}
```

Add to cluster:

```bash
kubectl apply -f config/kubernetes/cert-manager/issuer.yaml
```

## Create Certificate for your domain

edit config/kubernetes/cert-manager/certificate.yaml and add your domains

```ruby
apiVersion: certmanager.k8s.io/v1alpha1
kind: Certificate
metadata:
  name: hutchdev-ca
spec:
  secretName: tls-secret
  issuerRef:
    name: letsencrypt-prod
    kind: Issuer
  commonName: hutchdev.ca
  dnsNames:
  - hutchdev.ca
  - www.hutchdev.ca
  acme:
    config:
    - http01:
        ingressClass: nginx
      domains:
      - hutchdev.ca
      - www.hutchdev.ca
```

Add to cluster:

```bash
kubectl apply -f config/kubernetes/cert-manager/certificate.yaml
```

## Update Ingress

Finally, our ingress in the previous nginx ingress guide was originally created without access to the tls-secret or hosts. We need to update these few lines and reapply it to our cluster:

amend config/kubernetes/ingress.yaml to add the tls section with your domain:

```bash
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: boilerplate-map
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  tls:
  - hosts:
    - hutchdev.ca
    - www.hutchdev.ca
    secretName: tls-secret
  rules:
  - host: hutchdev.ca
    http:
      paths:
      - path: /
        backend:
          serviceName: boilerplate-service
          servicePort: 80
  - host: www.hutchdev.ca
    http:
      paths:
        - path: /
          backend:
            serviceName: boilerplate-service
            servicePort: 80
```

Update our cluster:

```bash
kubectl apply -f config/kubernetes/ingress.yaml
```

Congratulations, you now have cert-manager installed which should have retrieved certificates for your domains and stored them within a secret on your cluster. Your ingress should be updated to use those certifcates so that your domains should now be accessible by https.
