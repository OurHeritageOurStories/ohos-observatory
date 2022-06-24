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
                                    alert('Server side error');
                                    } else {
                                        alert("Uploaded")
                                    }
                                })
                                .catch(error=>{
                                    alert('Client side error while uploading');
                                })
                    },
                    (error)=>{
                        alert('Error while deleting'+error);
                    }
                )
            },
    }
}

</script>

<template>
<div id="upload_form">
    <form @submit.prevent="upload_data">
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