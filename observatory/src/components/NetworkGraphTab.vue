<script lang="ts">

import { reactive, ref } from "vue"
import * as vNG from "v-network-graph"
import {
  ForceLayout,
  ForceNodeDatum,
  ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"
import LoadDataVue from "./LoadData.vue";


export default{
    data(){
        return{
            graph_status: "Select data in the Select tab please",          
            playground_data:null,
            nodes: {},
            edges: {},
            layouts: {},
            configs: reactive(
              vNG.defineConfigs({
                view: {
                  layoutHandler: new ForceLayout({
                    positionFixedByDrag: false,
                    positionFixedByClickWithAltKey: true,
                  }),
                },
                node: {
                  normal: {
                    color: n => (n.id === "node0" ? "#ff0000" : "#4466cc"),
                  },
                  label: {
                    visible: true,
                  },
                },
                edge: {
                  type: "curve",
                  marker: {
                    source: {
                      type: "arrow",
                    }
                  },                  
                },
              })
            ),
            eventHandlers: {
              "node:click": ({ node }) => {
                alert(node);
              },
            }
        };
    },
    created(){
        this.graph_status = this.graph_status.replace("Select data in the Select tab please", "Fetching data... If this message disappears but the graph doesn't show, switch between tabs");
        console.log("Fetching data...");
        fetch('api/graph?query=SELECT * {?s ?p ?o}',{
            headers:{"Accept":"application/sparql-results+json"}
        })
            .then(response=>response.json())
            .then(response=>(this.post=response))
            .then(response=>this.draw_graph(response));
    },
    methods:{
        draw_graph(fetched_data){
            this.graph_status = this.graph_status.replace("Fetching data", "Drawing graph");
            console.log("Drawing graph...")
            var results = fetched_data.results.bindings;
            var subs = [];
            for (let i = 0; i < results.length; i++){
                let obj = results[i];
                var sub = obj.s.value;
                var pre = obj.p.value;
                var obje = obj.o.value;
                this.nodes[obje] = { name: obje }; //this.nodes[obje] = { name: obje, face: "/src/assets/OHOS_Logo.png" };
                this.edges[i] = { source: sub, target: obje, label: pre };
                this.nodes[sub] = { name: sub };  //this.nodes[sub] = { name: sub, face: "/src/assets/OHOS_Logo.png" };
                //console.log(JSON.stringify(this.nodes[sub]))

                //if sub multiple times in results, and P18:
                //this.nodes[obje] = { name: obje, face: obje }; 
                if(subs.includes(JSON.stringify(this.nodes[sub]))) // && pre=="http://www.wikidata.org/prop/direct/P18"
                  {       
                    console.log("In: ", JSON.stringify(this.nodes[sub]))
                    this.nodes[obje] = { name: obje, face: obje };
                    this.nodes[sub] = { name: sub, face: obje };                
                  } else if(pre=="http://www.wikidata.org/prop/direct/P18") {       
                    //this.nodes[obje] = { name: obje, face: obje };//current, future below:
                    this.nodes[sub] = { name: sub, face: obje };
                    delete this.edges[i];
                    delete this.nodes[obje];                
                  }   
                subs.push(JSON.stringify(this.nodes[sub]));         
            }
            this.graph_status = this.graph_status.delete;
            console.log("The graph should be ready. If it doesn't display, switch between tabs.")
            console.log(JSON.stringify(subs))
        }
    }
}

</script>

<template>
<div id="graphStatus">{{ graph_status }}</div>
<v-network-graph
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs"
    :layers="layers"
    :event-handlers="eventHandlers"
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
