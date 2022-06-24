<script>

//var input = document.querySelector('input[type="file"]')

//var data = new FormData()


export default{
    data(){
        return{
            return_data:null,
            insert_response:null,
            upload:null
        };
    },
    created(){

    },
    methods:{
        NOdelete_data(){
            try{
                var datafile =document.querySelector('input[type="file"]');
                this.upload = datafile.files[0]; //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!async here
            } finally {
            fetch('api/graph?DROP ALL',{
                method:"DELETE"
            })
                .then(response=>(this.insert_response=response))
                .then(response=>this.upload_data())
            }
        },
        NOupload_data(){
            fetch('api/graph?',{
                method:"POST",
                headers:{"Content-Type":"text/plain"},
                body:this.upload
            })
                .then(response=>response.json())
                .then(response=>(this.return_data=response))
        },
        delete_current_data(){
            let promise = new Promise(function (resolve, reject){
                fetch('api/graph?DROP ALL',{
                    method: "DELETE"
                })
                    .then(function(response){
                        if(response.status==200){
                            resolve()
                        } else {
                            reject()
                        }
                    })
                    .catch(error=>{
                        reject(error)
                    })
            });
            return promise;
        },
        upload_data_file(){
            let promise = new Promise(function (resolve, reject){
                let delete_data_promise = delete_current_data();
                delete_data_promise.then(
                    (result)=>{
                        fetch('api/graph?',{
                            method:"POST",
                            headers:{"Content-Type":"text/plain"},
                            body:this.upload
                        })
                            .then(function(response){
                                if(response.status==200){
                                    resolve()
                                } else {
                                    reject()
                                }
                            })
                            .catch(error=>{
                                reject(error)
                            })
                    },
                    (error)=>{
                        reject(error)
                    }
                )
            });
            return promise;
        },
        upload_file(){
            var datafile = document.querySelector('input[type="file"]');
            this.upload = datafile.files[0];
            let promise = this.upload_data_file();
            promise.then(
                (result)=>{
                    alert("Uploaded. Please note this file is ephemeral - if you choose any other data, you will need to upload again.")
                },
                (error)=>{
                    alert("Something went wrong. Please note down how you saw this and let the TNA OHOS team know. Error: ")
                }
            )
        }
    }
}

</script>

<template>

    <form>
        <div>
            <label>Select file to upload</label>
            <input type="file">
        </div>
        <button type="submit" @click="upload_file">Upload</button>
    </form>
    Please note, this upload is ephemeral. If you select a new dataset in any way, you will need to upload again. 

    <pre>{{ response }} bbbbbbbbbb</pre>

</template>

<style>
</style>