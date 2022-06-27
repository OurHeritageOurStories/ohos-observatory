<script>

export default{
    data(){
        return{

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
    }
}
</script>

<template>
</template>

<style>
</style>