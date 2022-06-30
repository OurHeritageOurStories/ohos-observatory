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
<div id="sidebar">
    <img alt="OHOS" src="./assets/OHOS_Logo.png"/>
    <h1>Observatory</h1>
    <a href="#sidebar">This is a link!</a><br>
    <a href="#tabs">This too is a link!</a><br>
    <a href="#content">This as well is a link!</a><br>
</div>

<div id="tabs" class="container">
  
    <div class="tabs">
        <a v-on:click="activetab='1'" v-bind:class="[ activetab === '1' ? 'active' : '' ]">Select</a>
        <a v-on:click="activetab='2'" v-bind:class="[ activetab === '2' ? 'active' : '' ]">Graph View</a>
    </div>

    <div id="content" class="content">
        <div v-if="activetab ==='1'" class="tabcontent">
            <SelectDataTab />
        </div>
        <div v-if="activetab ==='2'" class="tabcontent">
            <NetworkGraphTab />
        </div>
    </div>
  
</div>
</template>

<style>

@import url("http://fonts.cdnfonts.com/css/gill-sans-nova");
@font-face {
    font-family: "ETBembo";
    src: url("assets/fonts/ETBembo-RomanOSF.otf") format("opentype");
}

    #sidebar {
        right: 10px;
        position: absolute;
        height: 100%;
        color: #888; 
    }
    #sidebar img {
        max-height: 120px;
        max-width: 100px;
    }

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Gill Sans Nova", sans-serif; 
}

h1, h2, h3, h4, h5, h6 {
    font-family: "ETBembo", sans-serif;
}

.container {  
    max-width: 80%;
    left: 10px;
    position: absolute;
    margin: 20px auto;
}

.tabs {
    overflow: hidden;
    margin-bottom: -2px;
    margin-left: 24px;
    color: #888;
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
