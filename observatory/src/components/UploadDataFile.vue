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
        delete_data(){
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
        upload_data(){
            fetch('api/graph?',{
                method:"POST",
                headers:{"Content-Type":"text/plain"},
                body:this.upload
            })
                .then(response=>response.json())
                .then(response=>(this.return_data=response))
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
        <button type="submit" @click="delete_data">Upload</button>
    </form>
    Please note, this upload is ephemeral. If you select a new dataset in any way, you will need to upload again. 

    <pre>{{ response }} bbbbbbbbbb</pre>

</template>

<style>
</style>