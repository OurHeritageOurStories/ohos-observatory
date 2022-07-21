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
    <h3 id="general_dataset_heading">Choose a dataset from below, then take a look at the Graph View tab</h3>
    <h4 id="load_data_heading">If you would prefer to see a pre-defined dataset, please choose from the set below</h4>
    <div id="load_data_vue">
        <LoadDataVue />
    </div>
    <h4 id="upload_file_heading">If you would upload a file containing a graph database, please do so here</h4>
    <div id="upload_file_vue">
        <UploadDataFileVue />
    </div>
    <h4 id="choose_forign_url_heading">If you would like to load a graph database from an external url, please do so here</h4>
    <div id="choose_forign_url_vue">
        <ChooseDataUriVue />
    </div>
</div>
</template>
<style>
h3, p{
    line-height: 1.2;
}
#insert_data_tab_grid{
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    padding: 10px;
}
#general_choose_data_tab_intro{
    grid-row-start: 1;
    grid-row-end: 2;
    padding: 10px;
    padding-top: 25px;
}
#general_dataset_heading{
    grid-row-start: 5;
    grid-row-end: 6;
    padding: 10px;
    padding-top: 25px;
}
#load_data_heading{
    grid-row-start: 7;
    grid-row-end: 8;
    padding: 10px;
    padding-top: 25px;
    border-top: 2px solid;
}
#load_data_vue{
    grid-row-start: 8;
    grid-row-end: 9;
    padding: 10px;
}
#upload_file_heading{
    grid-row-start: 10;
    grid-row-end: 11;
    padding: 10px;
    padding-top: 25px;
    border-top: 2px solid;
}
#upload_file_vue{
    grid-row-start: 11;
    grid-row-end: 12;
    padding: 10px;
}
#choose_forign_url_heading{
    grid-row-start: 13;
    grid-row-end: 14;
    padding: 10px;
    padding-top: 25px;
    border-top: 2px solid;
}
#choose_forign_url_vue{
    grid-row-start: 14;
    grid-row-end: 15;
    padding: 10px;
}
fieldset{
    border: 0;
}
</style>