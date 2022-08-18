<script>

export default{
    data(){
        return{
            return_text: "push the button",
        };
    },
    methods:{
        get_from_flask_promise(){
            return new Promise((resolve, reject)=>{
                fetch(
                    'api/manifest/'
                )
                    .then(
                        (function(response){
                            console.log(response);
                            if (response.status==200){
                                resolve(response.json())
                            } else {
                                reject("Non-200 response from the iiif generator")
                            }
                        })
                    )
            })
        },
        get_iiif_manifest(){
            let promise = this.get_from_flask_promise();
            promise.then(
                (resolve)=>{
                    this.return_text = resolve;
                },
                (reject) => {
                    this.return_text = reject;
                }
            )
        }
    }
}

</script>

<template>

<button @click="get_iiif_manifest()">button</button>

<pre>
    {{ return_text }}
</pre>

</template>

<style>
</style>