<script>
import SelectDataTab from './components/SelectDataTab.vue';
import NetworkGraphTab from './components/NetworkGraphTab.vue';

export default{
    components:{
        SelectDataTab,
        NetworkGraphTab
    },
    data: function() { 
      return {
        activetab: '1' 
        }
    },
}

</script>

<template>
<div id="tabs" class="container">
  
    <div class="tabs">
        <a v-on:click="activetab='1'" v-bind:class="[ activetab === '1' ? 'active' : '' ]">Select Data</a>
        <a v-on:click="activetab='2'" v-bind:class="[ activetab === '2' ? 'active' : '' ]">Graph View</a>
        <a v-on:click="activetab='3'" v-bind:class="[ activetab === '3' ? 'active' : '' ]">Tab 3</a>
        <a v-on:click="activetab='4'" v-bind:class="[ activetab === '4' ? 'active' : '' ]">Tab 4</a>
    </div>

    <div class="content">
        <div v-if="activetab ==='1'" class="tabcontent">
            <SelectDataTab />
        </div>
        <div v-if="activetab ==='2'" class="tabcontent">
            <NetworkGraphTab />
        </div>
        <div v-if="activetab ==='3'" class="tabcontent">
            <p>This is tab 3!</p>
        </div>
        <div v-if="activetab ==='4'" class="tabcontent">
            <p>This is tab 4!</p>
        </div>
    </div>
  
</div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {  
    width: 100%;
    margin: 40px auto;
    font-size: 0.9em;
    color: #888;
}

.tabs {
    overflow: hidden;
    margin-bottom: -2px;
    margin-left: 24px;
}

.tabs a{
    float: left;
    cursor: pointer;
    padding: 12px 24px;
    transition: background-color 0.2s;
    border: 1px solid #ccc;
    border-right: none;
    background-color: #f1f1f1;
    border-radius: 10px 10px 0 0;
    font-weight: bold;
}
.tabs a:last-child { 
    border-right: 1px solid #ccc;
}

.tabs a:hover {
    background-color: #aaa;
    color: #fff;
}

.tabs a.active {
    background-color: #fff;
    color: #484848;
    border-bottom: 2px solid #fff;
    cursor: default;
}
</style>
