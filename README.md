# ohos-observatory

[Our Heritage, Our Stories (OHOS)](https://ohos.ac.uk/) is a [Towards a National Collection (TaNC)](https://www.nationalcollection.org.uk/) project linking together community generated digital content (CGDC) and displaying this linked content to the end user. The work here is “The Observatory”, a web-app designed to visualise this linked CGDC, and is part of The National Archives (TNA) work in the OHOS project. 

This project is currently at Minimum Viable Product stage. 

NOTE: The Vue app can be run with or without the database/Kong running in the background. Without the database, it will simply not show some elements, as there is no data available. The Vue app may also be less stable and might crash when using some elements without the database running.

### Requirements

* VSCode
* Docker
* Web Browser

### Useful

* Insomnia
* [HTTPie](https://httpie.io)

## Contains

* Kong config file
* Vue3 app
* Docker file, to generate:
    * Graph database served by Blazegraph
    * Graph database served by GraphDB
    * Miiify
    * Kong API

## How to run (without the database active, undockerised Vue)

1. Open a terminal in the ohos-observatory directory, run 'npm run dev', then go to 'localhost:3000' on your browser.

## How to run (without database, dockerised Vue)

1. Open a terminal in the ohos-observatory directory, run 'docker build -t ohos_observatory_frontend .'

2. Run this image with the command 'docker run -d -p 3000:3000 ohos_observatory_frontend' .

3. Go to 'localhost:3000' on your browser.

## How to run (with the database active, dockerised Vue)

1. Clone repo

2. Open a terminal in the ohos-observatory directory, run 'docker build -t ohos_observatory_frontend .'

3. Open a terminal in the flask_responses_to_iiif_utility directory, run 'docker build -t ohos-iiif-manifest .'

3. Run dockercompose.yaml with the command 'docker-compose up' to generate a local Blazegraph, Miiify, Flask-based IIIF generator, and GraphDB server, the Vue front-end, and a Kong API.

4. Transfer kong_config.yml to the Kong API

    a. This can either be done as per the Kong documentation, or via Insomnia. It requires sending a POST request to 'http://localhost:8001/config', with the contents of kong_config.yml, and the header 'Content-Type: text/yaml'. You should get a response of a JSON file containing details about the various routes that have been created.

    b. To test that this has worked, you should be able to contact miiify via http://localhost:8000/annotation/hello. Either run 'http http://localhost:8000/annotation/hello' (requires HTTPie), 'curl http://localhost:8000/annotation/hello', or go directly through Insomnia. You should receive the response > Welcome to miiify!

5. Data can then be sent to Blazegraph by sending a post to http://localhost:8000/graph-all-access?

6. Go to 'localhost:3000' on your browser.


## How to access the SPARQL endpoint. 

The database can be accessed directly, and queried using SPARQL commands. To do so, launch the app as per the “database active” instructions. 
Once it is active, SPARQL queries can be passed to it directly by querying the URL below, adding the SPARQL query in plain text after the '?'  

    http://localhost:8000/graph?

#### Headers 
Headers are required to get a response. The suggested default is 

    {Accept: application/json}'
    
See [here](https://github.com/blazegraph/database/wiki/REST_API#rdf-data) for several other options. 

#### Query example

Below is an example query to the SPARQL endpoint using [HTTPie](https://httpie.io), and the start of the response. 

##### Endpoint query: 
    
    > http GET 'http://localhost:8000/graph?query=SELECT * {?s ?p ?o} LIMIT 100' Accept:application/json

##### Response:

    HTTP/1.1 200 OK
    Connection: keep-alive
    Content-Type: application/sparql-results+json;charset=utf-8
    Server: Jetty(9.4.18.v20190429)
    Transfer-Encoding: chunked
    Via: kong/2.8.0
    X-Kong-Proxy-Latency: 32
    X-Kong-Upstream-Latency: 56

    {
        "head": {
            "vars": [
                "s",
                "p",
                "o"
            ]
        },
        "results": {
            "bindings": [
                {
                    "o": {
'


## Standards in Use

1. [Agile](https://www.atlassian.com/agile#:~:text=Agile%20is%20an%20iterative%20approach,small%2C%20but%20consumable%2C%20increments.) 
2. [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)

### Libraries

1. [Vue3](https://vuejs.org)
2. [v-network-graph](https://dash14.github.io/v-network-graph/)

### Tools

1. [Insomnia](https://insomnia.rest)

### Data formats

This project is working with and investigating the possible uses of linked data. For this, we are currently using two linked data formats to store our data: .nt and .ttl/.ttlx. 
1. .nt (aka N-triples) simply stores the triples in full size plain text. This makes them very easy for software to generate and parse, but they can become verbose. For example:
    * <:bob> <:knows> <:alice> 
    * <:bob> <:knows> <:dave>
2. .ttl/.ttlx (aka Turtle, or Terse RDF Triple Language) is designed to be more human-readable, and to look similar to SPARQL queries. It is less verbose, leaving out repeated subjects or predicates where possible. Note that if the next triple repeats the predicate, the triple is followed by a comma; if the next triple repeats the subject, the triple is followed by a semi-colon. For example:
    * :bob :knows :alice,
                  :dave .

### Multiple-strand plan

 Several separate prototypes will be produced at the same time, in order to investigate different approaches to visualise, interact, and work with the available data. 
  * Existing content management system based (P1)  - Working with Omeka-S and other existing tools to investigate whether they adequately answer  the research questions. 
  * Bespoke (2D) (P2)  - A bespoke web-app based on Vue3, designed from the ground up to investigate what can be done with linked data for the benefit of the end user
  * Experimental (3D) (P3)  - An investigative look into technologies that may be the future of exhibitions. Particular focus will be paid to 3d environments such as [Mozilla hubs](https://hubs.mozilla.com/)
  
### CSS Standards

<img width="654" alt="css_bubbles" src="https://user-images.githubusercontent.com/105296158/180023546-bc3bb26f-1ebb-4b54-8e54-11ad3c5f80e7.PNG">
