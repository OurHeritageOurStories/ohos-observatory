<script>

export default{
    data(){
        return{
            finalised_json: null,
            return_text: null,
        };
    },
    methods:{
        dbpedia_get_thumbnail_image_promise_alt(ref){
            return new Promise((resolve, reject)=>{
                fetch(
                    "https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Fi+WHERE+%7B%0D%0A+++%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F" + ref + "%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fthumbnail%3E+%3Fi%7D%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on",
                    {
                        method:"GET"
                    }
                )
                    .then(response => response.json())
                    .then(response => {
                        resolve(response.results.bindings[0].i.value);
                    })
                    .catch(error=>{
                        reject("error");
                    });
            });
        },
        get_image_resolution_promise_alt(image_url){
            return new Promise((resolve, reject)=>{
                    var image = new Image();
                    image.onload = function(){
                        resolve([image.naturalHeight, image.naturalWidth]) //if your image returns a 404 - eg Spratton DBPedia thumbnail - this breaks. See - https://national-archives.atlassian.net/jira/software/projects/OHOS/boards/82/backlog?selectedIssue=OHOS-703
                    }
                    image.onerror = function(){ //this check for 404 doesn't seem to work
                        reject("the image 404's");
                    };
                    image.src = image_url;
            });
        },
        get_distinct_objects_promise(){
            let promise = new Promise(function (resolve, reject){
                fetch(
                    'api/graph?query=SELECT DISTINCT ?s where {?s ?p <http://dbpedia.org/resource/Organization> } LIMIT 4',
                    {
                    headers:{"Accept":"application/json"}
                    }
                )
                    .then(response => response.json())
                    .then(response => response.results.bindings)
                    .then(response=>{
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error.message)
                    });
            });
            return promise;
        },
        construct_rest_of_json(start_of_json, list_of_objects_metadata){
            var completed_json = start_of_json;
            completed_json.items = [];
            for (let i = 0; i < list_of_objects_metadata.length; i++){
                completed_json.items[i] = {};
                completed_json.items[i].id = list_of_objects_metadata[i].thumbnail_url;
                completed_json.items[i].type = "canvas";
                completed_json.items[i].height = list_of_objects_metadata[i].height_px;
                completed_json.items[i].width = list_of_objects_metadata[i].width_px;
                completed_json.items[i].items = [];
                completed_json.items[i].items[0] = {};
                completed_json.items[i].items[0].id = list_of_objects_metadata[i].thumbnail_url;
                completed_json.items[i].items[0].type = "AnnotationPage";
                completed_json.items[i].items[0].items = [];
                completed_json.items[i].items[0].items[0] = {};
                completed_json.items[i].items[0].items[0].id = list_of_objects_metadata[i].thumbnail_url;
                completed_json.items[i].items[0].items[0].type = "Annotation";
                completed_json.items[i].items[0].items[0].motivation = "Painting";
                completed_json.items[i].items[0].items[0].body = {};
                completed_json.items[i].items[0].items[0].body.id = list_of_objects_metadata[i].thumbnail_url;
                completed_json.items[i].items[0].items[0].body.type = "Image";
                completed_json.items[i].items[0].items[0].body.format = "image/"+list_of_objects_metadata[i].image_type;
                completed_json.items[i].items[0].items[0].body.height = list_of_objects_metadata[i].height_px;
                completed_json.items[i].items[0].items[0].body.width = list_of_objects_metadata[i].width_px;
                completed_json.items[i].items[0].items[0].target = list_of_objects_metadata[i].thumbnail_url;     //this json building approach seems silly - if you're reading this and know of a more elegent and less verbose way to do it, please do
            };
            this.return_text = completed_json;
        },
        build_json_ld_images_metadata_stage_two(start_of_json, list_of_objects_metadata){
            async function loop(context){
                for (let i = 0; i < list_of_objects_metadata.length; i++){var height_and_width = await context.get_image_resolution_promise_alt(list_of_objects_metadata[i].thumbnail_url)
                        .catch((error) => function(){
                            list_of_objects_metadata.splice(i, 1); //goodbye non-gettable image 
                            console.log("error with", list_of_objects_metadata[i]);
                            console.log("get metadata error", error)});
                    list_of_objects_metadata[i].height_px = height_and_width[0];
                    list_of_objects_metadata[i].width_px = height_and_width[1];
                    let thumbnail_url_parts = list_of_objects_metadata[i].thumbnail_url.split(".");
                    list_of_objects_metadata[i].image_type = thumbnail_url_parts[thumbnail_url_parts.length-1];      
                };
            }
            loop(this).then(
                _ => this.construct_rest_of_json(start_of_json, list_of_objects_metadata)
            );
        },
        build_json_ld_images_metadata(start_of_json, list_of_objects){            
            let object_images_with_metadata = []; //form of {url: url, height: px, width; px}
            async function loop(context){
                for (let i = 0; i < list_of_objects.length; i++){
                    let image_and_metadata = {};
                    let image = list_of_objects[i].s.value.split("/");
                    let image_reference = image[image.length-1];
                    var thumbnail_url_returned = await context.dbpedia_get_thumbnail_image_promise_alt(image_reference)
                        .catch((error) => function(){
                            list_of_objects.splice(i, 1); //goodbye broken link
                            console.log("build json image metadata error", error);
                            console.log("error with", list_of_objects[i], image_reference);
                        })
                    image_and_metadata.thumbnail_url = thumbnail_url_returned.replaceAll('?width=300', ''); //we want the full size one, not the tiny thumbnail
                    object_images_with_metadata[i] = image_and_metadata;
                };
            };
            loop(this).then(
                _ => this.build_json_ld_images_metadata_stage_two(start_of_json, object_images_with_metadata)
                );
        },
        build_json_ld_start(){
            var json_ld_being_built = {};
            json_ld_being_built["@context"] = "http://iiif.io/api/presentation/3/context.json";
            json_ld_being_built["@id"] = "Test manifest";
            json_ld_being_built.type = "Manifest";
            var list_of_objects_promise = this.get_distinct_objects_promise();
            list_of_objects_promise.then(
                (result)=>{
                    this.build_json_ld_images_metadata(json_ld_being_built, result)
                },
                (error)=>{
                    console.log(error + "build_json_ld_start");
                    reject(error + "build_json_ld_start");
                }
            );
        }
    }
}

</script>

<template>

<button @click="build_json_ld_start()">Button</button>
<pre>
    {{ return_text }}
</pre>

</template>

<style>
</style>