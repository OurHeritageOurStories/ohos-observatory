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
            playground_data:null,
            nodes: {},
            edges: {},
            nodeLabel: {},
            edgeLabel: {},
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
              })
            ),
            eventHandlers: {
              "node:click": ({ node }) => {
                console.log("Harshad");
                alert(node);
              },
            }
        };
    },
    created(){
        fetch('api/graph?query=SELECT * {?s ?p ?o}',{
            headers:{"Accept":"application/sparql-results+json"}
        })
            .then(response=>response.json())
            .then(response=>(this.post=response))
            .then(response=>this.draw_graph(response));
    },
    methods:{
        draw_graph(fetched_data){
            var results = fetched_data.results.bindings;
            for (let i = 0; i < results.length; i++){
                let obj = results[i];
                var sub = obj.s.value;
                var pre = obj.p.value;
                var obje = obj.o.value;
                var refArray = sub.split("/");
                var ref = refArray[refArray.length-1];
                fetch(
                      "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&origin=*&format=json&&formatversion=2&ids="+ref,
                      {
                        method: "GET"
                      }
                    )
                      .then(response => response.json())
                      .then(response => (this.nodeLabel=response))
                      .then(response => {
                        console.log(this.nodeLabel.entities)
                        console.log(ref);
                        console.log(this.nodeLabel.entities[ref]);
                      })
                      .catch(error => {
                        console.log(error.message);
                      });
                refArray = pre.split("/");
                ref = refArray[refArray.length-1];
                if(pre=="http://www.wikidata.org/prop/direct/P18")
                    this.nodes[sub] = { name: sub, face: obje };
                else
                    {
                        this.nodes[sub] = { name: sub };
                        this.nodes[obje] = { name: obje };
                        this.edges[i] = { source: sub, target: obje, label: pre };
                    }
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
