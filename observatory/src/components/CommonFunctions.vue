<script>

export default{
      fetch_image_promise(ref){
          let label = null;
          let endpoint = 'https://dbpedia.org/sparql';
          let sparqlQuery = "SELECT ?i WHERE { {<http://dbpedia.org/resource/" + ref + "> <http://dbpedia.org/ontology/thumbnail> ?i}}";
          let fullUrl = endpoint + '?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=' + encodeURIComponent( sparqlQuery );
          let headers = { 'Accept': 'application/sparql-results+json' };
          let promise = new Promise(function (resolve, reject){
              fetch( fullUrl, { headers } )
                    .then(response => response.json())
                    .then(response => (label = response))
                    .then(response => {
                      resolve(label);
                    })
                    .catch(error => {
                      reject(error.message);
                    });
          });
          return promise;
      },

      
}

</script>
