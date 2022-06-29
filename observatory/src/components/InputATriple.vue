<script>

export default{
    data(){
        return{
            code:null
        };
    },
    methods:{
        post_triple_promise(subjectString, predicateString, objectString){
            let promise = new Promise(function (resolve, reject){
                const requestOptions = {
                    method: "POST",
                    header: {"Content-Type":"text/plain"},
                    body: "<:" + subjectString + "> " + 
                    "<:" + predicateString + "> " + 
                    "<:" + objectString + "> .", 
                };
                fetch('api/graph?', requestOptions) 
                    .then(function(response){
                        resolve(response.status);
                    })
                    .catch(error=>{
                        reject(error)
                    })
            });
            return promise;
        },
        build_alert_promise(){
            if(this.newDataObject && this.newDataPredicate && this.newDataSubject){
                let promise = this.post_triple_promise(this.newDataObject, this.newDataPredicate, this.newDataObject);
                promise.then(
                    (result)=>{
                        switch(result){
                            case 200:
                                alert("Sucsessfuly entered the new triple");
                                break;
                            case 500:
                                alert("Please ensure you have entered text in all three boxes. If you have entered punctuation, please remove it and try again.");
                                break;
                            case 404:
                                alert("404, probably a bad Kong setup. If you are not TNA OHOS team and have seen this, please let TNA OHOS team know.")
                                break;
                            default:
                                alert("Something went wrong, please refresh the page and try again. Please let the TNA OHOS team know. Error: IAT45")
                        }
                    },
                    (error) => {
                        throw "Unclear how you got here. Please let the TNA OHOS team know. Error: IAT49."
                    }
                );
            } else {
                throw "Please insure you have put text in each of the three boxes.";
            }
        },
        insert_the_triple(){
            try{
                this.build_alert_promise();
            } catch (error){
                console.log("error");
                alert("Something went wrong. Please note down how you reached this point, and let the TNA OHOS team know.")
            }
        }
    }
}
</script>

<template>

<div id="insert_triple_grid">

    <p id="subject_title">Subject</p>
    <input v-model="newDataSubject" id="newDataSubject" /> 
    <p id="predicate_title">Predicate</p>
    <input v-model="newDataPredicate" id="newDataPredicate" />
    <p id="object_title">Object</p>
    <input v-model="newDataObject" id="newDataObject"/> 
    <button @click="insert_the_triple" id="post_new_triple">Insert new triple into the graph</button>

</div>

</template>

<style>
#insert_triple_grid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    padding: 5px;
}
#subject_title{
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 2;
    padding: 5px;
}
#newDataSubject{
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 3;
    padding: 5px;
}
#predicate_title{
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
    padding: 5px;
}
#newDataPredicate{
    grid-column-start: 2;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;
    padding: 5px;
}
#object_title{
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 1;
    grid-row-end: 2;
    padding: 5px;
}
#newDataObject{
    grid-column-start: 3;
    grid-column-end: 4;
    grid-row-start: 2;
    grid-row-end: 3;
    padding: 5px;
}
#post_new_triple{
    grid-column-start: 4;
    grid-column-end: 5;
    grid-row-start: 1;
    grid-row-end: 3;
    padding: 5px;
}
</style>