<script>

export default{
    methods:{
        fetch_image_promise(ref){
            let label = null;
            let promise = new Promise(function (resolve, reject){
                fetch(
                      "https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Fi+WHERE+%7B%0D%0A+++%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F" + ref + "%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fthumbnail%3E+%3Fi%7D%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on",
                      {
                        method: "GET"
                      }
                    )
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
}

</script>

