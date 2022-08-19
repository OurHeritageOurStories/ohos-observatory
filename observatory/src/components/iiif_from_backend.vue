<script>

export default{
    data(){
        return{
            return_text: "This is currently a proof of concept to generate IIIF manifests from RDF data. To get this to work, select AI lab 2, and press this button. On teh back end, a search will happen, and the response sent to this page. It take a couple of moments, so don't worry if nothing appears to happen at first.",
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

<button @click="get_iiif_manifest()" class="button">button</button>

<pre>
    {{ return_text }}
</pre>

</template>

<style>
</style>