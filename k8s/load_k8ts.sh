start minikube

helm install miiify miiify
helm install blazegraph blazegraph
helm install go-api go-api
helm install react-frontend react-frontend
helm install kong kong --set service.port=5000
helm install iiif-generator iiif-generator

kubectl port-forward svc/kong 5000:5000