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
                fetch('api/graph-full-access?DROP ALL',{
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
                        fetch('api/graph-full-access?',{
                                method:"POST",
                                headers:{"Content-Type":"text/plain"},
                                body: uploaded,
                            })
                                .then(function(response){
                                    if(!response.status==200){
                                        throw 'Server side error UDF42';
                                    } else {
                                        alert("Uploaded the data")
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
                    console.log(error);
                    alert("Something went wrong while uploading the datafile. " + error)
                }
            }
    }
}

</script>

<template>
<div id="upload_form">
    <form @submit.prevent="upload_file">
        <div>
            <input type="file"><button type="submit" class="button">Submit</button>
        </div>   
    </form>
    </div>
    Please note, this upload is ephemeral. If you select a new dataset in any way, you will need to upload again. Please be patient after clicking Submit. 

</template>

<style>
</style>