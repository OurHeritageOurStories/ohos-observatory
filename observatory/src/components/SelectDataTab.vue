<script>

import InputATripleVue from "./InputATriple.vue";
import LoadDataVue from "./LoadData.vue";
import UploadDataFileVue from "./UploadDataFile.vue";
import ChooseDataUriVue from "./ChooseDataUri.vue";

export default{
    components:{
        InputATripleVue,
        LoadDataVue,
        UploadDataFileVue,
        ChooseDataUriVue
    }
}

</script>

<template>


<div id="insert_data_tab">
    <p>If you would like to insert a new triple into the current graph, please do so below</p> 
    <InputATripleVue />
    <p>Choose which dataset you would prefer to see below</p>
    <LoadDataVue />
    <p>If you would upload a file, please do so here</p>
    <UploadDataFileVue />
    <p>if you would like to load data from an external url, here</p>
    <ChooseDataUriVue />
</div>


</template>

<style>
</style>