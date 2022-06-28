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
    <p>Choose below which dataset you would prefer to see. Then take a look at the Graph View tab. 
        Be patient though; the graph can take a long time to show up. If it takes a minute, switching tabs around might help.</p>
    <LoadDataVue />
</div>


</template>

<style>
</style>