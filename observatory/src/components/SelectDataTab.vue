<script>

import InputATripleVue from "./InputATriple.vue";
import LoadDataVue from "./LoadData.vue";
import UploadDataFileVue from "./UploadDataFile.vue";

export default{
    components:{
        InputATripleVue,
        LoadDataVue,
        UploadDataFileVue
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
</div>


</template>

<style>
</style>