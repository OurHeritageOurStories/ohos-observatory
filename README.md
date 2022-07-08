# ohos-observatory

OHOS Observatory product. Currently MVP. 

NOTE: The Vue app can be run with or without the database/Kong running in the background. Without the database, it will simply not show some elements, as there is no data available. The Vue app may also be less stable and might crash when using some elements without the database running.

### Requirements

    VSCode
    Docker
    Web Browser

### Useful

    Insomnia
    HTTPie

### Contains

    Docker file to generate:

o Graph database served by Blazegraph

o Graph database served by GraphDB

o Miiify

o Kong API

    Kong config file
    Vue3 app

### How to run (without the database active, undockerised Vue)

1- Open a terminal in the observatory directory, run 'npm run dev', then go to 'localhost:3000' on your browser.

### How to run (without database, dockerised Vue)

1- Open a terminal in the ohos-poc-1-main directory, run 'docker build -t ohos_observatory_frontend .'

2- Run this image with the command 'docker run -d -p 3000:3000 ohos_observatory_frontend' .

3- Go to 'localhost:3000' on your browser.

### How to run (with the database active, dockerised Vue)

1- Clone repo

2- Open a terminal in the ohos-poc-1-main directory, run 'docker build -t ohos_observatory_frontend .'

3- Run dockercompose.yaml to generate a local Blazegraph, Miiify, and GraphDB server, the Vue front-end, and a Kong API.

a. To do thisrun 'docker-compose up'

4- Transfer kong_config.yml to the Kong API

a. This can either be done as per the Kong documentation, or via Insomnia. It requires sending a POST request to 'http://localhost:8001/config', with the contents of kong_config.yml, and the header 'Content-Type: text/yaml'. You should get a response of a JSON file containing details about the various routes that have been created.

b. To test that this has worked, you should be able to contact miiify via http://localhost:8000/annotation/hello. Either run 'http http://localhost:8000/annotation/hello' (requires HTTPie), 'curl http://localhost:8000/annotation/hello', or go directly through Insomnia. You should receive the response > Welcome to miiify!

5- Data can then be sent to Blazegraph by sending a post to http://localhost:8000/graph?

5- Go to 'localhost:3000' on your browser.


### Standards in Use

1. [Agile](https://www.atlassian.com/agile#:~:text=Agile%20is%20an%20iterative%20approach,small%2C%20but%20consumable%2C%20increments.) Currently in sprint 8. 2, 2. [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)

### Libraries

1. [Vue3](https://vuejs.org)
2. [v-network-graph](https://dash14.github.io/v-network-graph/)

### Tools

1. [Insomnia](https://insomnia.rest)

### Plans

1. Multiple-strand
  *Several seperate 