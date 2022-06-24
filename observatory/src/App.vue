<script>
import SelectDataTab from './components/SelectDataTab.vue';

export default{
    components:{
        SelectDataTab
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
        <a v-on:click="activetab='2'" v-bind:class="[ activetab === '2' ? 'active' : '' ]">Tab 2</a>
        <a v-on:click="activetab='3'" v-bind:class="[ activetab === '3' ? 'active' : '' ]">Tab 3</a>
        <a v-on:click="activetab='4'" v-bind:class="[ activetab === '4' ? 'active' : '' ]">Tab 4</a>
    </div>

    <div id="content" class="content">
        <div v-if="activetab ==='1'" class="tabcontent">
            <SelectDataTab />
        </div>
        <div v-if="activetab ==='2'" class="tabcontent">
            <p>This is tab 2!</p>
        </div>
        <div v-if="activetab ==='3'" class="tabcontent">
            <h2>This is tab 3!</h2>
        </div>
        <div v-if="activetab ==='4'" class="tabcontent">
            <h1>This is tab 4!</h1>
            <h2>This <b>is</b> tab 4!</h2>
            <h3>This <i>is</i> tab 4!</h3>
            <h4>This is tab 4!</h4>
            <h5>This is tab 4!</h5>
            <h6>This is tab 4!</h6>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
  color: #888;  
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
