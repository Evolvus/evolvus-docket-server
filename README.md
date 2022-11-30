# evolvus-docket-server
Evolvus Docket Server is an audit server. It can be plugged into any application.
It store audit events into a MongoDB store.

### Prerequisites
1) MongoDB
2) Node

## To build the docker image
```
sudo docker build -t hobbs.evolvus.com:11083/docket-node-service .
```

## To deploy the image to nexus
```
docker image push hobbs.evolvus.com:11083/docket-node-service:latest
```

## To run the service
```
export TZ=Asia/Kolkata
export MONGO_DB_URL=mongodb://UserAdmin:12356789@10.24.62.134:27017/testdb?poolSize=100&authSource=admin
export DEBUG=evolvus*

docker run -d --rm --name sandstorm-docket-service-e TZ -e MONGO_DB_URL -e DEBUG -p 8085:8085 182.72.155.166:10515/docket-node-service:latest
```

## Contributing
Thank you very much for considering to contribute!

Please make sure you follow our [Code Of Conduct](CODE_OF_CONDUCT.md) and we also strongly recommend reading our [Contributing Guide](CONTRIBUTING.md).
