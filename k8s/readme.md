# Kubernetes deployment

Instructions on how to deploy the OHOS Observatory to a local minikube environment. 

This will deploy the tech-stack used for the publically avaiable web app locally for testing and development. Or just expoloration, if you fancy having a look! 

## Reqs

- Minikube
- Helm

## Start minikube

`minikube start`

## Deploy

`
helm install kong kong 
helm install miiify miiify
helm install go-api go-api
helm install blazegraph blazegraph
`

Then, depending on what state of development the project is, either 

`helm install react-frontend`
or 
`helm install vue-frontend`


## Alternative

run load_k8ts.sh