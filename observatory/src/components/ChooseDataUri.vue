<script>

export default{
    data(){
        return{
            url_for_data:null,
            data_gathered_to_insert:null,
            selected_data_type:null
        };
    },
    methods:{
        delete_current_data(){
            let promise = new Promise(function (resolve, reject){
                fetch('api/graph?DROP ALL',{
                    method: "DELETE"
                })
                    .then(function(response){
                        if(response.status==200){
                            resolve()
                        } else {
                            reject("Non-200 response from the server when deleting.")
                        }
                    })
                    .catch(error=>{
                        reject(error + "dave")
                    })
            });
            return promise;
        },
        gather_data(data_url){
            let promise = new Promise(function (resolve, reject){
                var gathered_data = null;
                var gathered_correctly = false;
                var response_code;
                fetch(data_url)
                    .then(function(response){
                        response_code=response.status;
                        //alert(response.status)
                    })
                    .then(response=>response.text())
                    .then(response=>gathered_data=response)
                    //.then(function(response){
                    //    if (response.status==200){
                    //        gathered_correctly = true;
                    //    } else {
                    //        reject("Non-200 response from the server when gathering data") ///I THINK THIS KEEPS TRIGGERING BECAUSE raw.github just 404's on me
                    //    }
                    //})
                    .catch(error=>{
                        reject(error + "dlak;jdsfl;ka")
                    })
                if (response_code==200){
                    resolve(gathered_data)
                }
                else {
                    reject("error: " + response_code)
                }
            });
            return promise            
        },
        insert_data_actual(){
            fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":this.selected_data_type},
                        body:this.data_gathered_to_insert
                    })
                        .then(function(response){
                            if(response.status!==200){
                                throw "Failure while uploading data"
                            }
                        })
        },
        insert_data(){
            let delete_data_promise = this.delete_current_data();
            let gather_data_promise = this.gather_data(this.url_for_data);
            Promise.all([delete_data_promise, gather_data_promise])
                .then(
                    this.insert_data_actual
                )
                .catch(error=>{
                    throw error
                })
                //.then((values)=>{
                //    console.log(values)
                //})
                //.then(
                //    fetch('api/graph?',{
                //        method:"POST",
                //        headers:{"Content-Type":data_type_header},
                //        body:data_gathered
                //    })
                //        .then(function(response){
                //            if(response.status!==200){
                //                throw "Failure while uploading data"
                //            }
                //        })
               // )
                //.catch(error=>{
                //    throw error
                //});
        },
        data_type(choice){
            switch(choice){
                case "n_triple":
                    this.selected_data_type = "text/plain";
                case "turtle_rdr":
                    this.selected_data_type = "application/x-turtle-RDR";
            }
        },
        gather_from_url(){
            if(this.url_for_data && this.selected_data_type){
                try{
                    this.insert_data()
                } catch (error){
                    console.log(error);
                    alert("Something went wrong. Please note down how you reached this point and let the TNA OHOS team know. Error code: CDU72. " + error)
                }
            } else {
                alert("You need to put a URL and choose which data type it is before pressing the button")
            }
        }
    }
}

</script>

<template>

<div id="insert_from_url">

    <p id="url_for_input_title">If you would like to gather data from a plain text URL please put it here</p>
    <input v-model="url_for_data" id="url_for_data"/>
    <p id="data_type_radio_group">Please select what data_type it is</p>
    <fieldset>
        <div>
            <input type="radio" id="n_triple" name="data_type" @click="data_type('n_triple')">
            <label for="n_triple">Standard triples</label>
        </div>
        <div>
            <input type="radio" id="turtle_star" name="data_type" @click="data_type('turtle_rdr')">
            <label for="turtle_star">Turtle star/x-turtle-rdr</label>
        </div>
    </fieldset>
    <button @click="gather_from_url" id="gather_from_url">Insert data from a URL here. Notes: this data will be ephemeral. This data MUST be in plain  format - e.g. a raw.github URL</button>

</div>


</template>

<style>
</style>