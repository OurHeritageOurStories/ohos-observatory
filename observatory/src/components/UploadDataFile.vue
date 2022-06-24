<script>

export default{
    data(){
        return{
            return_data:null,
            insert_response:null,
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
                            reject("Non-200 response from the server")
                        }
                    })
                    .catch(error=>{
                        reject(error)
                    })
            });
            return promise;
        },
        upload_data(){
            let promise = this.delete_current_data();
                promise.then(
                    (result)=>{
                        var datafile = document.querySelector('input[type="file"]');
                        var uploaded = datafile.files[0];
                        fetch('api/graph?',{
                                method:"POST",
                                headers:{"Content-Type":"text/plain"},
                                body: uploaded,
                            })
                                .then(function(response){
                                    if(!response.status==200){
                                        throw 'Server side error UDF42';
                                    } else {
                                        alert("Uploaded")
                                    }
                                })
                                .catch(error=>{
                                    throw 'Client side error while uploading. UDF48';
                                })
                    },
                    (error)=>{
                        throw 'Error while deleting'+error + "UDF52";
                    }
                )
            },
            upload_file(){
                try{
                    this.upload_data();
                } catch (error){
                    console.log("error");
                    alert("Something went wrong. Please note down how you reached this point, and let the TNA OHOS team know.")
                }
            }
    }
}

</script>

<template>
<div id="upload_form">
    <form @submit.prevent="upload_file">
        <div>
            <label>Select file to upload</label>
            <input type="file">
        </div>
        <button type="submit">Sumbit</button>
    </form>
    </div>
    Please note, this upload is ephemeral. If you select a new dataset in any way, you will need to upload again. 

</template>

<style>
</style>