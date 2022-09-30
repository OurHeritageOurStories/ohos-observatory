<script>

export default{
    data(){
        return{
            manufactured_data:null,
            playground_data:null,
            ai_lab_2:null,
            ai_lab_1:null
        };
    },
    created(){
        fetch('/src/assets/datasets/multimedia types triples.nt')
            .then(response=>response.text())
            .then(response=>(this.manufactured_data=response));
        fetch('/src/assets/datasets/playground.nt')
            .then(response=>response.text())
            .then(response=>(this.playground_data=response));
        fetch('/src/assets/datasets/ai_lab_2_extracted.ttl')
            .then(response=>response.text())
            .then(response=>(this.ai_lab_2=response));
        fetch('/src/assets/datasets/ai_lab_1.ttl')
            .then(response=>response.text())
            .then(response=>(this.ai_lab_1=response));
    },
    methods:{
        delete_data_promise(){
            let promise = new Promise(function (resolve, reject){
                fetch('api/graph-full-access?DROP ALL', {
                    method: "DELETE"
                })
                    .then(function(response){
                        if(response.status==200){
                            resolve()
                        } else {
                            reject("Non-200 response from the server")
                        }
                    })
                    .catch(error=>{
                        reject(error)
                    })
            });
            return promise;
        },
        insert_data(choice){
            let promise = this.delete_data_promise();
            promise.then(
                (result)=>{
                    switch(choice){
                        case "manufactured":
                            fetch('api/graph-full-access?',{
                                method:"POST",
                                headers:{"Content-Type":"text/plain"},
                                body:this.manufactured_data
                            })
                                .then(function(response){
                                    if (response.status==200){
                                        alert("Data updated")
                                    }
                                })
                            break;
                        case "playground":
                            fetch('api/graph-full-access?',{
                                method:"POST",
                                headers:{"Content-Type":"text/plain"},
                                body: this.playground_data
                            })
                                .then(function(response){
                                    if (response.status==200){
                                        alert("Data updated")
                                    }
                                })
                            break;
                        case "ai_lab_2":
                            fetch('api/graph-full-access?',{
                                method:"POST",
                                headers:{"Content-Type":"text/plain"},
                                body:this.ai_lab_2
                            })
                                .then(function(response){
                                    if (response.status==200){
                                        alert("Data updated")
                                    }
                                })
                            break;
                        case "ai_lab_1":
                            fetch('api/graph-full-access?',{
                                method:"POST",
                                headers:{"Content-Type":"application/x-turtle-RDR"},
                                body:this.ai_lab_1
                            })
                                .then(function(response){
                                    if (response.status==200){
                                        alert("Data updated")
                                    }
                                })
                            break;
                        default:
                            throw 'Unreachable error reached. Somehow, a non-chooseable option was chosen. Error: UD99.';
                    }
                },
                (error)=>{
                    throw "Error in deleting the data: " + error + "Error: UD103.";
                }
            )
        },
        update_data(choice){
            try{
                this.insert_data(choice);
            }
            catch (error){
                console.log(error);
                alert("Something went wrong while trying to load a pre-configured data-set. Please note down how you reached this point, and let the TNA OHOS team know. ERROR: " + error)
            }
        }
    }
}

</script>

<template>


<fieldset>

    <div>
        <input type="radio" id="manufactured" name="data_set" value="manufactured" @click="insert_data('manufactured')">
        <label for="manufactured">Manufactured</label>
    </div>

    <div>
        <input type="radio" id="playground" name="data_set" value="playground" @click="insert_data('playground')">
        <label for="playground">Playground</label>
    </div>

    <div>
        <input type="radio" id="ai_lab_1" name="data_set" value="ai_lab_1" @click="insert_data('ai_lab_1')">
        <label for="ai_lab_1">AI Lab initial dataset</label>
    </div>

    <div>
        <input type="radio" id="ai_lab_2" name="data_set" value="ai_lab_2" @click="insert_data('ai_lab_2')">
        <label for="ai_lab_2">AI Lab second dataset</label>
    </div>

</fieldset>

</template>

<style>
</style>