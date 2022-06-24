<script>

//var input = document.querySelector('input[type="file"]')

//var data = new FormData()


export default{
    data(){
        return{
            return_data:null,
            insert_response:null,
            //upload:null
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
                            resolve(response.status)
                        } else {
                            reject(error)
                        }
                    })
                    .catch(error=>{
                        reject(error)
                    })
            });
            return promise;
        },
        upload_data(){
            var datafile = document.querySelector('input[type="file"]');
            var upload = datafile.files[0];
            let delete_data_promise = this.delete_current_data();
            delete_data_promise.then(
                (result)=>{
                    fetch('api/graph?',{
                            method:"POST",
                            headers:{"Content-Type":"text/plain"},
                            body:this.upload
                        })
                            .then(function(response){
                                if(!response.status==200){
                                   alert('Server side error');
                                } else {
                                    alert("Sucsess")
                                }
                            })
                            .catch(error=>{
                                alert('Client side error while uploading');
                            })
                },
                (error)=>{
                    alert('Error while deleting');
                }
            )
        },
        //upload_file(){
        //    var datafile = document.querySelector('input[type="file"]');
        //    this.upload = datafile.files[0];
        //    try{
        //        this.upload_data();
         //   }
         //   catch (error){
         //       console.log(error);
         //       alert("Unexpected error occured. Please note down how you reached this message, and let the TNA OHOS team know. Error code: ");
         //   }
        //},
        
    }
}

</script>

<template>

    <form>
        <div>
            <label>Select file to upload</label>
            <input type="file">
        </div>
        <button type="submit" @click="upload_data">Upload</button>
    </form>
    Please note, this upload is ephemeral. If you select a new dataset in any way, you will need to upload again. 

    <pre>{{ response }} bbbbbbbbbb</pre>

</template>

<style>
</style>