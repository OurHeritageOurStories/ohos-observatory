<script lang="ts">

import { Nodes, defineConfigs, Edges, Layers } from "v-network-graph"
import LoadDataVue from "./LoadData.vue";


export default{
    data(){
        return{
            playground_data:null,
            nodes: {},
            edges: {},
            layouts: {},
        };
    },
    created(){
        fetch('api/graph?',{
                        method:"POST",
                        headers:{"Content-Type":"text/plain"},
                        body: this.playground_data
                    });
        fetch('api/graph?query=SELECT * {?s ?p ?o}',{
            headers:{"Accept":"application/sparql-results+json"}
        })
            .then(response=>response.json())
            .then(response=>(this.post=response))
            .then(response=>this.draw_graph(response));
    },
    methods:{
        draw_graph(fetched_data){
            console.log(fetched_data.results);
            var results = fetched_data.results.bindings;
            for (let i = 0; i < results.length; i++){
                let obj = results[i];
                var sub = obj.s.value;
                var pre = obj.p.value;
                var obje = obj.o.value;
                this.nodes[sub] = { name: sub };
                this.nodes[obje] = { name: obje };
                this.edges[i] = { source: sub, target: obje, label: pre };
                this.layouts[sub] = {x:Math.random(), y:Math.random()};
                this.layouts[obje] = {x:Math.random(), y:Math.random()};
            }
        }
    }
}

</script>

<template>

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
