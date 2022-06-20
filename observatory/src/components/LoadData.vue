<script>

export default{
    data(){
        return{
            manufactured_data:null,
            playground_data:null,
            ai_lab_data_updated:null,
            al_lab_data_first:null
        };
    },
    created(){
        fetch('/src/assets/datasets/multimedia types triples.nt')
            .then(response=>response.text())
            .then(response=>(this.manufactured_data=response));
        fetch('/src/assets/datasets/playground.nt')
            .then(response=>response.text())
            .then(response=>(this.playground_data=response));
        fetch('/src/assets/datasets/ai_lab_2.ttl')
            .then(response=>response.text())
            .then(response=>(this.ai_lab_data_updated=response));
        fetch('/src/assets/datasets/ai_lab_1.ttl')
            .then(response=>response.text())
            .then(response=>(this.al_lab_data_first=response));
    },
    methods:{
        update_data(choice){

            //first, empty the database
            fetch('api/graph?DROP ALL',{
                method:"DELETE"
            })
            
            //then re-fill it with the data we want to look at
            switch(choice){ 
                case "manufactured":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"text/plain"},
                        body:this.manufactured_data
                    })
                    break;
                case "playground":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"text/plain"},
                        body: this.playground_data
                    });
                    break;
                case "ai_lab":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"application/x-turtle-RDR"},
                        body:this.ai_lab_data_updated
                    })
                    break;
                case "ai_lab_initial_data":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"application/x-turtle-RDR"},
                        body:this.al_lab_data_first
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
        <input type="radio" id="ai_lab_initial_data" name="data_set" value="ai_lab_initial_data" @click="update_data('ai_lab_initial_data')">
        <label for="ai_lab_initial_data">Ai Lab initial dataset</label>
    </div>

    <div>
        <input type="radio" id="ai_lab" name="data_set" value="ai_lab" @click="update_data('ai_lab')">
        <label for="ai_lab">Ai Lab second dataset</label>
    </div>

</fieldset>

</template>

<style>
</style>