<script>
import SelectDataTab from './components/SelectDataTab.vue';
import NetworkGraphTab from './components/NetworkGraphTab.vue';
import AboutTab from './components/AboutTab.vue';
import InputATripleVue from "./components/InputATriple.vue";

export default{
    components:{
        SelectDataTab,
        NetworkGraphTab,
        AboutTab,
        InputATripleVue
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
    <h1 class="observatory">Observatory</h1>
    <a href="#sidebar">This is a link!</a><br>
    <a href="#tabs">This too is a link!</a><br>
    <a href="#content">This as well is a link!</a><br>
</div>

<div id="tabs" class="container">
  
    <div class="tabs">
        <a v-on:click="activetab='1'" v-bind:class="[ activetab === '1' ? 'active' : '' ]">About</a>
        <a v-on:click="activetab='2'" v-bind:class="[ activetab === '2' ? 'active' : '' ]">Select</a>
        <a v-on:click="activetab='3'" v-bind:class="[ activetab === '3' ? 'active' : '' ]">Add</a>
        <a v-on:click="activetab='4'" v-bind:class="[ activetab === '4' ? 'active' : '' ]">Graph View</a>
    </div>

    <div id="content" class="content">
        <div v-if="activetab ==='1'" class="tabcontent">
            <AboutTab /> 
        </div>
        <div v-if="activetab ==='2'" class="tabcontent">
            <SelectDataTab />
        </div>
        <div v-if="activetab ==='3'" class="tabcontent">
            <InputATripleVue />
        </div>
        <div v-if="activetab ==='4'" class="tabcontent">
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
html {
min-width: 950px;
min-height: 950px;
position: relative;
}
#sidebar {
    right: 10px;
    position: absolute;
    height: 100%;
    color: #787878; 
}
#sidebar img {
    max-height: 120px;
    max-width: 100px;
}
#sidebar a {
    color: #787878; 
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Gill Sans Nova", "Arial";
  color: #303030;  
}
h1, h2, h3, h4, h5, h6 {
    color: #383838; 
    font-family: "ETBembo", "Arial Black";
}
.container {  
    max-width: 80%;
    min-width: 60%;
    position: relative;
    margin: 20px;
}
.tabs {
    overflow: hidden;
    margin-bottom: -2px;
    margin-left: 24px;
    color: #383838;
}
.tabs a{
    float: left;
    cursor: pointer;
    padding: 12px 24px;
    transition: background-color 0.2s;
    border: 1px solid #ccc;
    border-right: none;
    background-color: #e7d2ea;
    border-radius: 10px 10px 0 0;
    font-family: "ETBembo", "Arial Black";
}
.tabs a:last-child { 
    border-right: 1px solid #ccc;
}
.tabs a:hover {
    background-color: #ca5ed6;
    color: #fff;
}
.tabs a.active {
    background-color: #fff;
    color: #383838;
    border-bottom: 2px solid #fff;
    cursor: default;
}
.button {
    background-color: #e7d2ea;
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
    border-radius: 30px;
    font-family: "ETBembo", "Gill Sans Nova", "Arial Black";
    margin: 5px;
}
.button:hover {
    background-color: #ca5ed6;
    color: #fff;
}
.observatory {
    color: #787878;
}
input[type='radio'] {
    accent-color: #787878;
}
.tabcontent {
    padding: 30px 50px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 4px 4px 8px #e1e1e1;
}

</style>
