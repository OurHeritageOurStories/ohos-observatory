<script lang="ts">

import { Nodes, defineConfigs, Edges, Layers } from "v-network-graph"

export default{
    data(){
        return{
            manufactured_data:null,
            playground_data:null,
            ai_lab_2:null,
            ai_lab_1:null,
            nodes: {},
            edges: {},
        };
    },
    created(){
        fetch('/src/assets/datasets/multimedia types triples.nt')
            .then(response=>response.text())
            .then(response=>(this.manufactured_data=response));
        fetch('/src/assets/datasets/playground.nt')
            .then(response=>response.text())
            .then(response=>(this.playground_data=response))
            .then(response=>this.draw_graph(response));
        fetch('/src/assets/datasets/ai_lab_2.ttl')
            .then(response=>response.text())
            .then(response=>(this.ai_lab_2=response));
        fetch('/src/assets/datasets/ai_lab_1.ttl')
            .then(response=>response.text())
            .then(response=>(this.ai_lab_1=response));
    },
    methods:{
        delete_data(choice){ //first, empty the database
            fetch('api/graph?DROP ALL',{
                method:"DELETE"
            })
                .then(response=>this.update_data(choice))//only update the data AFTER we have deleted it. Or we could be updating the data, then emptying the database. Which leaves us with nothing. 
        },
        update_data(choice){ //then re-fill it with the data we want to look at            
            switch(choice){ 
                case "manufactured":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"text/plain"},
                        body:this.manufactured_data
                    })
                    break;
                case "playground":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"text/plain"},
                        body: this.playground_data
                    });
                    break;
                case "ai_lab_2":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"application/x-turtle-RDR"},
                        body:this.ai_lab_2
                    })
                    break;
                case "ai_lab_1":
                    fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"application/x-turtle-RDR"},
                        body:this.ai_lab_1
                    })
                    break;
                default:
                    alert("If you have seen this message, please note down how and let the OHOS TNA team know - it should be unreachable from the UI!")
            }
                
        },
        draw_graph(fetched_data){
            var results = fetched_data.split(" .");
            for (let i = 0; i < results.length-1; i++){
                let obj = results[i].split('<');
                console.log(obj);
                var sub = obj[1].slice(0,-2);
                var pre = obj[2].slice(0,-2);
                var obje = obj[3].slice(0,-2);
                this.nodes[sub] = { name: sub };
                this.nodes[obje] = { name: obje };
                this.edges[i] = { source: sub, target: obje, label: pre };
            }
            console.log(this.nodes);
            console.log(this.edges);
        }
    }
}

</script>

<template>

<fieldset>

    <div>
        <input type="radio" id="manufactured" name="data_set" value="manufactured" @click="delete_data('manufactured')">
        <label for="manufactured">Manufactured</label>
    </div>

    <div>
        <input type="radio" id="playground" name="data_set" value="playground" @click="delete_data('playground')">
        <label for="playground">Playground</label>
    </div>

    <div>
        <input type="radio" id="ai_lab_1" name="data_set" value="ai_lab_1" @click="delete_data('ai_lab_1')">
        <label for="ai_lab_1">Ai Lab initial dataset</label>
    </div>

    <div>
        <input type="radio" id="ai_lab_2" name="data_set" value="ai_lab_2" @click="delete_data('ai_lab_2')">
        <label for="ai_lab_2">Ai Lab second dataset</label>
    </div>

</fieldset>

<v-network-graph
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs"
    :layers="layers"
  >
    <defs>
      <clipPath id="faceCircle" clipPathUnits="objectBoundingBox">
        <circle cx="0.5" cy="0.5" r="0.5" />
      </clipPath>
    </defs>
    <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.label" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
    <template #override-node="{ nodeId, scale, config, ...slotProps }">
      <circle class="face-circle" :r="config.radius * scale" fill="#ffffff" v-bind="slotProps" />
      <image
        class="face-picture"
        :x="-config.radius * scale"
        :y="-config.radius * scale"
        :width="config.radius * scale * 2"
        :height="config.radius * scale * 2"
        :xlink:href="`${nodes[nodeId].face}`"
        clip-path="url(#faceCircle)"
      />
      <circle
        class="face-circle"
        :r="config.radius * scale"
        fill="none"
        stroke="#808080"
        :stroke-width="1 * scale"
        v-bind="slotProps"
      />
    </template>
  </v-network-graph>

</template>

<style lang="scss" scoped>
// transitions when scaling on mouseover.
.face-circle,
.face-picture {
  transition: all 0.1s linear;
}

// suppress image events so that mouse events are received
// by the background circle.
.face-picture {
  pointer-events: none;
}
</style>
