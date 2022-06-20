<script>

import InputATripleVue from "./InputATriple.vue";
import LoadDataVue from "./LoadData.vue";

export default{
    components:{
        InputATripleVue,
        LoadDataVue
    }
}

</script>

<template>


<div id="insert_data_tab">
    <p>If you would like to insert a new triple into the current graph, please do so below</p> 
    <InputATripleVue />
    <p>Choose which dataset you would prefer to see below</p>
    <LoadDataVue />
</div>


</template>

<style>
</style>