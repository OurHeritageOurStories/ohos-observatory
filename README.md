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

    Kong config file
    Vue3 app
    Docker file, to generate:
    o Graph database served by Blazegraph
    o Graph database served by GraphDB
    o Miiify
    o Kong API

### How to run (without the database active, undockerised Vue)

1. Open a terminal in the ohos-observatory directory, run 'npm run dev', then go to 'localhost:3000' on your browser.

### How to run (without database, dockerised Vue)

1. Open a terminal in the ohos-observatory directory, run 'docker build -t ohos_observatory_frontend .'

2. Run this image with the command 'docker run -d -p 3000:3000 ohos_observatory_frontend' .

3. Go to 'localhost:3000' on your browser.

### How to run (with the database active, dockerised Vue)

1. Clone repo

2. Open a terminal in the ohos-observatory directory, run 'docker build -t ohos_observatory_frontend .'

3. Run dockercompose.yaml with the command 'docker-compose up' to generate a local Blazegraph, Miiify, and GraphDB server, the Vue front-end, and a Kong API.

4. Transfer kong_config.yml to the Kong API

    a. This can either be done as per the Kong documentation, or via Insomnia. It requires sending a POST request to 'http://localhost:8001/config', with the contents of kong_config.yml, and the header 'Content-Type: text/yaml'. You should get a response of a JSON file containing details about the various routes that have been created.

    b. To test that this has worked, you should be able to contact miiify via http://localhost:8000/annotation/hello. Either run 'http http://localhost:8000/annotation/hello' (requires HTTPie), 'curl http://localhost:8000/annotation/hello', or go directly through Insomnia. You should receive the response > Welcome to miiify!

5. Data can then be sent to Blazegraph by sending a post to http://localhost:8000/graph?

6. Go to 'localhost:3000' on your browser.


### Standards in Use

1. [Agile](https://www.atlassian.com/agile#:~:text=Agile%20is%20an%20iterative%20approach,small%2C%20but%20consumable%2C%20increments.) Currently in sprint 8.
2. [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/)

### Libraries

1. [Vue3](https://vuejs.org)
2. [v-network-graph](https://dash14.github.io/v-network-graph/)

### Tools

1. [Insomnia](https://insomnia.rest)

### Data formats

This project is working with and investgating the possible uses of linked data. For this, we are currently using two linked data formats to store our data: .nt and .ttl/.ttlx. 
1. .nt (aka N-triples) simply stores the triples in full size plain text. This makes them very easy for software to generate and parse, but they can become verbose. For example:
    * <:bob> <:knows> <:alice> 
    * <:bob> <:knows> <:dave>
2. .ttl/.ttlx (aka Turtle, or Terse RDF Triple Language) is designed to be more human-readable, and to look similar to SPARQL queries. It is less verbose, leaving out repeated subjects or predicates where possible. Note that if the next triple repeats the predicate, the triple is followed by a comma; if the next triple repeats the subject, the triple is followed by a semi-colon. For example:
    * :bob :knows :alice,
                  :dave .

### Plans

1. Multiple-strand
  * Several separate prototypes will be produced at the same time, in order to investigate different approaches to working with the available data. 
  * Omeka-S - Working with 
  * Bespoke - A bespoke web-app based on Vue3, designed from the ground up to investigate what can be done with linked data for the benefit of the end user
  * Future - An investigative look into technologies that may be the future of exhibitions. Particular focus will be paid to 3d environments such as [Mozilla hubs](https://hubs.mozilla.com/)
  
### CSS Standards

<img width="654" alt="css_bubbles" src="https://user-images.githubusercontent.com/105296158/180023546-bc3bb26f-1ebb-4b54-8e54-11ad3c5f80e7.PNG">
