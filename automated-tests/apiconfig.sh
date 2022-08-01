curl --request POST \
  --url http://localhost:8001/config \
  --header 'Content-Type: text/yaml' \
  --data '_format_version: "2.1"
_transform: true

services: 

  - name: kong_blazegraph
    url: http://kong_blazegraph:8080/bigdata/#splash
    routes:
      - name: kong_blazegraph_routes_home
        paths:
          - /graph/hello
        strip_path: true
        methods:
        - GET
        
  - name: kong_blazegraph_api_query_post
    url: http://kong_blazegraph:8080/bigdata/sparql
    routes: 
      - name: kong_blazegraph_routes_query_post
        paths:
          - /graph?
        preserve_host: true  
        strip_path: true
        methods:
        - GET
        - POST
        - DELETE 
      
  - name: kong_miiify
    url: https://kong_miiify:8080
    routes:
      - name: kong_miiify_routes_home
        paths:
            - /annotation/hello
        strip_path: true
        methods:
        - GET
        
  - name: kong_miiify_add_anotation
    url: https://kong_miiify:8080/annotations/
    routes:
      - name: kong_miiify_routes_add_annotation
        paths:
          - /annotation/
        strip_path: true
        preserve_host: true        
        methods:
        - POST
        - GET
        - PUT
        - DELETE'
