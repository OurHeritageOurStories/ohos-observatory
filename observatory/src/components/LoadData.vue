<script>

//var links_to_data = {
//    "manufactured":"https://raw.githubusercontent.com/nationalarchives/ohos-poc-1/main/OHOS-PoC/docs/test%20data%20options/multimedia%20types%20triples?token=GHSAT0AAAAAABU6DE6TWYSLNBN3MSYECYXQYVMR24A",
//    //"playground":"https://raw.githubusercontent.com/nationalarchives/ohos/main/data/HC%20extract%20images%20-%20direct%20image%20references?token=GHSAT0AAAAAABU6DE6TOY43BCN2SDMJXKC6YVMROLA",
//    "playground":"@/assets/datasets/playground.nt",
//    "ai_lab":"awaiting PR"/
//}

//var playground_dataset = ('@/assets/datasets/multimedia types triples.nt')
//var ai_lab_dataset = require('@')

//var playground_dataset = 'src/assets/datasets/playground.nt'

export default{
    data(){
        return{
            //test: '/src/assets/datasets/multimedia types triples.nt'
            test:null,
            upcheck:null
        };
    },
    created(){
        fetch('/src/assets/datasets/multimedia types triples.nt')
            .then(response=>response.text())
            .then(response=>(this.test=response));
        fetch('api/graph?query=SELECT * {?s ?p ?o}',{
            headers:{"Accept":"application/sparql-results+json"}
        })
            .then(response=>response.json())
            .then(response=>(this.upcheck=response));
    },
    methods:{
        update_data(choice){
            //var data;
            //fetch()
            fetch('api/graph?DROP ALL')//empty the database
            switch(choice){ //then re-fill it with the data we want to look at
                case "manufactured":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"text/plain"},
                        body:'/src/assets/datasets/multimedia types triples.nt'
                    })
                    break;
                case "playground":
                    //var file;
                    //fetch("https://raw.githubusercontent.com/nationalarchives/ohos/main/data/HC%20extract%20images%20-%20direct%20image%20references?token=GHSAT0AAAAAABU6DE6TOY43BCN2SDMJXKC6YVMROLA")
                    //    .then(response=>(console.log(response)));
                    //fetch('exaple.com',{
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"text/plain"},
                        ////body:'@/src/assets/datasets/playground data images.nt'
                        //body:'/assets/datasets/playground.nt'
                        body: this.test
                        //body:links_to_data.playground
                    });
                    break;
                case "ai_lab":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"application/x-turtle-RDR"},
                        body:'/src/assets/datasets/AI lab output 9 6 22.ttl'
                    })
                    break;
                default:
                    alert("If you have seen this message, please note down how and let the OHOS TNA team know - it should be unreachable from the UI!")
            }
        }
    },
    emits:['selected_data']
}
</script>

<template>

<fieldset>

    <div>
        <input type="radio" id="manufactured" name="data_set" value="manufactured" @click="update_data('manufactured')">
        <label for="manufactured">Manufactured</label>
    </div>

    <div>
        <input type="radio" id="playground" name="data_set" value="playground" @click="update_data('playground')">
        <label for="playground">Playground</label>
    </div>

    <div>
        <input type="radio" id="ai_lab" name="data_set" value="ai_lab" @click="update_data('ai_lab')">
        <label for="ai_lab">Ai Lab</label>
    </div>

</fieldset>

<pre>{{ upcheck }}</pre>---ggggggggggggg

</template>

<style>
</style>