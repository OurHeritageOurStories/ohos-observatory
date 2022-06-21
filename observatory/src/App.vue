<template>
<div id="tabs" class="container">
  
    <div class="tabs">
        <a v-on:click="activetab='1'" v-bind:class="[ activetab === '1' ? 'active' : '' ]">Tab 1</a>
        <a v-on:click="activetab='2'" v-bind:class="[ activetab === '2' ? 'active' : '' ]">Tab 2</a>
        <a v-on:click="activetab='3'" v-bind:class="[ activetab === '3' ? 'active' : '' ]">Tab 3</a>
        <a v-on:click="activetab='4'" v-bind:class="[ activetab === '4' ? 'active' : '' ]">Tab 4</a>
    </div>

<SelectDataTab/>
    <div class="content">
        <div v-if="activetab ==='1'" class="tabcontent">
            <p>This is tab 1!</p>
        </div>
        <div v-if="activetab ==='2'" class="tabcontent">
            <p>This is tab 2!</p>
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

<script>
import SelectDataTab from './components/SelectDataTab.vue';

export default({
    el: '#tabs',
    data: function() { 
      return {
        activetab: '1' 
        }
    },
});
</script>

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
