<script>
//import { Console } from 'console';

//import { sleep } from 'pactum';


export default{
    data(){
        return{
            test_response:null,
            other_test:null,
            text_holder:null,
        };
    },
    methods:{
        dbpedia_get_thumbnail_promise(ref){
            let promise = new Promise(function (resolve, reject){
                console.log("ref", ref);
                //await sleep(1000);//temp to test things
                fetch(
                    "https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Fi+WHERE+%7B%0D%0A+++%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F" + ref + "%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fthumbnail%3E+%3Fi%7D%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on",
                    {
                        method:"GET"
                    }
                )
                    .then(response => response.json())
                    .then(response => {
                        console.log("response to thumbnail", response.results.bindings);
                        console.log("deeper response to thumbnail", response.results.bindings[0].i.value);
                        //if (response.results.bindings.i.value){
                        //    resolve(response.results.bindings.i.value)
                        //} else {
                        //    reject("no thumbnail");
                        //}
                        //try (response)
                        //resolve("dlakj")
                        resolve(response.results.bindings[0].i.value);
                    })
                    .catch(error => {
                        reject(error.message);
                    });
            });
            return promise;
        },
        get_image_resolution(image_url){// from https://stackoverflow.com/questions/11442712/get-width-height-of-remote-image-from-url
            //const image = new Image();
            //var height_px;
            //var width_px;
            //console.log("image resolution url", url);
            //image.addEventListener("load", function(){
            //    height_px = this.naturalHeight;
            //    width_px = this.naturalWidth;
            //});
            //image.src = url;
            //console.log("height", height_px, "width", width_px)
            //return[height_px, width_px];
            ////var image = new Image();
            ////var height_px;
            ///var width_px;
            //image.onload = function(){
            //    height_px = this.height;
            //    width_px = this.width;
            //};
            ////image.addEventListener("load", ()=>{
                /////height_px = image.naturalHeight;
                ////width_px = image.naturalWidth;
            ////})
            ////image.src = url;
            ////console.log("height", height_px, "width", width_px);
            ////return[6, 43];
            console.log("get image resolution url", image_url);
            let promise = new Promise(function (resolve, reject){
                try{
                    var image = new Image();
                    var height_px;
                    var width_px;
                    image.addEventListener("load", ()=>{
                        height_px = image.naturalHeight;
                        width_px = image.naturalWidth;
                    });
                    image.src = image_url;
                    console.log("height", height_px, "width", width_px);
                    resolve([height_px, width_px]);
                } catch (error){
                    reject(error);
                }
            });
            return promise;
        },
        build_more_json_ld_fragment(thumbnail_url){
            console.log("testing result", thumbnail_url);
            var fragment = {};
            fragment.items = [];
            fragment.items[0] = {};
            fragment.items[0].id = thumbnail_url;
            fragment.items[0].type = "Canvas";
            //var height_and_width = context.get_image_resolution(result);
            var promise = this.get_image_resolution(thumbnail_url);
            promise.then(
                (result_height_and_width)=>{
                    fragment.items[0].height = result_height_and_width[0];
                    fragment.items[0].width = result_height_and_width[1];
                    fragment.items[0].items = [];
                    fragment.items[0].items[0] = {};
                    fragment.items[0].items[0].id = thumbnail_url;
                    fragment.items[0].items[0].type = "AnnotationPage";
                    fragment.items[0].items[0].items = [];
                    fragment.items[0].items[0].items[0] = {};
                    fragment.items[0].items[0].items[0].id = thumbnail_url;
                    fragment.items[0].items[0].items[0].type = "Annotation";
                    fragment.items[0].items[0].items[0].motivation = "painting";
                    fragment.items[0].items[0].items[0].body = {};
                    fragment.items[0].items[0].items[0].body.id = thumbnail_url;
                    fragment.items[0].items[0].items[0].body.type = "Image";
                    fragment.items[0].items[0].items[0].body.format = "image/jpeg";
                    fragment.items[0].items[0].items[0].body.height = result_height_and_width[0];
                    fragment.items[0].items[0].items[0].body.width = result_height_and_width[1];
                    fragment.items[0].items[0].items[0].target = thumbnail_url;
                },
                (error) =>{
                    console.log(error);
                }
            );
            return fragment;
        },
        build_json_ld_fragment(context, url){
            let promise = new Promise(function (resolve, reject){
                console.log("url being passed to get thumbnail", url);
                var promise = context.dbpedia_get_thumbnail_promise(url);
                //var height_and_width_promise = context.get_image_resolution()
                //var promise = dbpedia_get_thumbnail_promise(url);
                promise.then(
                    (result) => {
                        //var fragment = context.build_more_json_ld_fragment(context, result);
                        var fragment = context.build_json_ld_fragment(result);
                        resolve(fragment);
                        //context = result[0];
                        //real_result = result[1];
                        //**//?8 */
                        //console.log("testing result", result);
                        //var fragment = {};
                        //fragment.items = [];
                        //fragment.items[0] = {};
                        //fragment.items[0].id = result;
                        //fragment.items[0].type = "Canvas";
                        ////var height_and_width = context.get_image_resolution(result);
                        //var promise = context.get_image_resolution(context, result);
                        //promise.then(
                        //    (result_height_and_width)=>{
                        //        fragment.items[0].height = result_height_and_width[0];
                        //        fragment.items[0].width = result_height_and_width[1];
                        //        fragment.items[0].items = [];
                        //        fragment.items[0].items[0] = {};
                        //        fragment.items[0].items[0].id = result;
                        //        fragment.items[0].items[0].type = "AnnotationPage";
                        //        fragment.items[0].items[0].items = [];
                        //        fragment.items[0].items[0].items[0] = {};
                        //        fragment.items[0].items[0].items[0].id = result;
                        //        fragment.items[0].items[0].items[0].type = "Annotation";
                        //        fragment.items[0].items[0].items[0].motivation = "painting";
                        //        fragment.items[0].items[0].items[0].body = {};
                        //        fragment.items[0].items[0].items[0].body.id = result;
                        //        fragment.items[0].items[0].items[0].body.type = "Image";
                        //        fragment.items[0].items[0].items[0].body.format = "image/jpeg";
                        //        fragment.items[0].items[0].items[0].body.height = result_height_and_width[0];
                        //        fragment.items[0].items[0].items[0].body.width = result_height_and_width[1];
                        //        fragment.items[0].items[0].items[0].target = result;
                        //        ////console.log("fragment");
                        //        //console.log(fragment);
                        //        //return fragment; 
                        //        resolve(fragment);
                        //        //const jeff = "jeff";
                        //        //resolve(jeff);
                        //        //resolve("jeff");
                        //    },
                        //    (error) => {
                        //        console.log(error);
                        //        reject(error);
                        //    }
                        //)
                        
                    },
                    (error) => {
                        console.log(error);
                        reject(error);
                    }
                )
            }
            );
            return promise;
        },
        get_disctinct_objects(){
            let promise = new Promise(function (resolve, reject){
                fetch(
                    'api/graph?query=SELECT DISTINCT ?s {?s ?p ?o} LIMIT 4',
                    {
                    headers:{"Accept":"application/json"}
                    }
                )
                    .then(response => response.json())
                    .then(response => response.results.bindings)
                    .then(response=>{
                        console.log("distinct objects resoponse", response);
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error.message)
                    });
            });
            return promise;
        },
        fragment_looper_promise(context, result, json_ld_being_built){
            let promise = new Promise(function (resolve, reject){
                
                json_ld_being_built.items = [];
                for (let i = 0; i < result.length; i++){
                    console.log("result", result);
                    let thing = result[i];
                    var bit = thing.s.value.split("/");
                    var specific_bit = bit[bit.length-1];
                    console.log("specific bit", specific_bit);
                    var promise = context.build_json_ld_fragment(context, specific_bit);
                    promise.then(
                        (result) => {
                            json_ld_being_built.items[i] = result.items;
                            //json_ld_being_built.push(result);
                            //json_ld_being_built.append(result);
                            console.log("json_ld_being_built.items", json_ld_being_built.items);
                        },
                        (error) => {
                            console.log(error);
                        }
                    )
                };
                resolve(json_ld_being_built.items);
                reject(error + "unlikley");
            });
            return promise;
        },
        build_json_ld(context){
            let promise = new Promise(function (resolve, reject){
                var promise = context.get_disctinct_objects();
                promise.then(
                    (result)=>{
                        var json_ld_being_built = {};
                        //json_ld_being_built.context = "http://iiif.io/api/presentation/3/context.json";
                        json_ld_being_built["@context"] = "http://iiif.io/api/presentation/3/context.json";
                        json_ld_being_built["@id"] = "test";
                        json_ld_being_built.type = "Manifest";
                        var promise = context.fragment_looper_promise(context, result, json_ld_being_built);
                        promise.then(
                            (result) => {
                                json_ld_being_built.items = result;
                                resolve(json_ld_being_built);
                            },
                            (error) => {
                                reject(error);
                            }
                        )
                    },
                    (error)=>{
                        reject(error);
                    }
                )
            });
            return promise;
        },
        build_output(){
            var promise = this.build_json_ld(this);
            promise.then(
                (result) => {
                    console.log("returned json here");
                    console.log(result);
                    console.log("returned json ld above here");
                    //sleep(5000);
                    //setTimeout(()=>this.other_test=result, 5000);
                    this.other_test = result;
                    //this.text_holder = result;
                    //fs.writeFile('./test.js');
                },
                (error) => {
                    console.log(error);
                }
            )
        },
        refresh_output(){
            this.text_holder = this.other_test;
        }
    }
}
</script>

<template>
text
<button @click="build_output()">test</button>
<pre>
    {{ test_response }}
</pre>
other_test
<pre>
    {{other_test}}
</pre>
<button @click="refresh_output()">Do thing</button>
<pre>
    {{text_holder}}
</pre>
</template>

<style>
</style>