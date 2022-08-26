<script>
import SelectDataTab from './components/SelectDataTab.vue';
import NetworkGraphTab from './components/NetworkGraphTab.vue';
import AboutTab from './components/AboutTab.vue';
import InputATripleVue from "./components/InputATriple.vue";
import Iiif_from_backend from './components/iiif_from_backend.vue';

export default{
    components:{
    SelectDataTab,
    NetworkGraphTab,
    AboutTab,
    InputATripleVue,
    Iiif_from_backend
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
    <a href="https://ohos.ac.uk/"  target="_blank">Our Heritage, Our Stories</a><br>
    <a href="https://www.nationalcollection.org.uk/"  target="_blank">Towards a National Collection</a><br>
</div>

<div id="tabs" class="container">
  
    <div class="tabs">
        <a v-on:click="activetab='1'" v-bind:class="[ activetab === '1' ? 'active' : '' ]">Home</a>
        <a v-on:click="activetab='2'" v-bind:class="[ activetab === '2' ? 'active' : '' ]">Change Dataset</a>
        <a v-on:click="activetab='3'" v-bind:class="[ activetab === '3' ? 'active' : '' ]">Add</a>
        <a v-on:click="activetab='4'" v-bind:class="[ activetab === '4' ? 'active' : '' ]">Explore</a>
        <a v-on:click="activetab='5'" v-bind:class="[ activetab === '5' ? 'active' : '' ]">IIIF manifest from the backend</a>
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
        <div v-if="activetab ==='5'" class="tabcontent">
            <Iiif_from_backend /> 
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
    color: #ca5ed6; 
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Gill Sans Nova", "ETBembo";
  color: #303030;  
}
h1, h2, h3, h4, h5, h6 {
    color: #383838; 
    font-family: "Gill Sans Nova", "ETBembo";
}
.container {  
    max-width: 75%;
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
    font-family: "Gill Sans Nova", "ETBembo";
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
    color: #ca5ed6;
    border-bottom: 2px solid #fff;
    cursor: default;
}
.button {
    background-color: #e7d2ea;
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
    border-radius: 30px;
    font-family: "Gill Sans Nova", "ETBembo";
    margin: 5px;
    box-shadow: 2px 2px 4px #e1e1e1;
}
.button:hover {
    background-color: #ca5ed6;
    color: #fff;
    box-shadow: 2px 2px 4px #e1e1e1;
}
.button:active {
    background-color: #fff;
    color: #ca5ed6;
}
.observatory {
    color: #787878;
}
input[type='radio'] {
    accent-color: #e7d2ea;
}
.tabcontent {
    padding: 30px 50px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 4px 4px 8px #e1e1e1;
}
.tabcontent a {
    color: #ca5ed6; 
}
.slider {
  -webkit-appearance: none;
  width: 25%;
  height: 10px;
  border-radius: 5px;
  background: #e7d2ea;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}
.slider:hover {
  opacity: 1;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #ca5ed6;
  cursor: pointer;
}
.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #ca5ed6;
  cursor: pointer;
}

</style>
