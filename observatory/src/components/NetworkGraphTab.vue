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
            labels: {},
            layouts: {},
            len: null,
            count: 0,
            fetched_data_copy: null,
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
        this.graph_status = this.graph_status.replace("Select data in the Select tab please", "Fetching data... If this message disappears but the graph doesn't show within a few seconds, switch between tabs");
        console.log("Fetching data...");
        fetch('api/graph?query=SELECT * {?s ?p ?o}',{
            headers:{"Accept":"application/sparql-results+json"}
        })
            .then(response=>response.json())
            .then(response=>(this.post=response))
            .then(response=>this.draw_graph(response));
    },
    methods:{
        fetch_label_promise(ref){
            let label = null;
            let promise = new Promise(function (resolve, reject){
                fetch(
                      "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&origin=*&format=json&&formatversion=2&ids="+ref,
                      {
                        method: "GET"
                      }
                    )
                      .then(response => response.json())
                      .then(response => (label = response))
                      .then(response => {
                        resolve(label);
                      })
                      .catch(error => {
                        reject(error.message);
                      });
            });
            return promise;
        },
        fetch_label(link){
            var refArray = link.split("/");
            switch(link.includes("wikidata.org/")){
                case true:
                    var ref =  refArray[refArray.length-1];
                    var promise = this.fetch_label_promise(ref, link);
                    promise.then(
                        (result)=>{
                            this.count = this.count + 1;
                            this.labels[link] = result.entities[ref].labels.en.value;
                            if(this.count == this.len*3)
                            {
                                this.make_connections();
                            }
                            return result;
                        },
                        (error)=>{
                            throw "Error: " + error;
                        }
                    );
                    break;
                case false:
                    this.count = this.count + 1;
                    return link;
            }
        },
        make_connections(){
            var OHOSLink = "https://ohos.ac.uk/wp-content/uploads/2021/12/cropped-OHOSIcon_Large.png";
            var imageCategory = ["P18","P109","P154","P41","P94","P948","P242","P1621","P2716","P3451","P4291","P8592","P2910"];
            let obj = null;
            var sub = null;
            var pre = null;
            var obje = null;
            var refArray = null;
            var refEdge =  null;
            var edgeLabelIsImage = null;
            
            for (let i = 0; i < this.len; i++){
                obj = this.fetched_data_copy[i];
                sub = obj.s.value;
                pre = obj.p.value;
                obje = obj.o.value;
                refArray = pre.split("/");
                refEdge =  refArray[refArray.length-1];
                edgeLabelIsImage = imageCategory.includes(refEdge);
                
                switch(true){
                    case(edgeLabelIsImage):
                        if(!this.nodes[sub] || this.nodes[sub].face == OHOSLink)
                            this.nodes[sub] = { name: this.labels[sub], face: obje };
                        else
                            if(this.nodes[sub])
                            {
                                this.nodes[obje] = { name: this.labels[obje], face: obje };
                                this.edges[i] = { source: sub, target: obje, label: this.labels[pre] };
                            }
                        break;
                    case(!edgeLabelIsImage):
                        switch(true){
                            case(!this.nodes[sub]):
                                this.nodes[sub] = { name: this.labels[sub], face: OHOSLink };
                                    this.nodes[obje] = { name: this.labels[obje], face: OHOSLink };
                                break;
                            case(this.nodes[sub]):
                                this.nodes[obje] = { name: this.labels[obje], face: OHOSLink };
                                break;
                        }
                        this.nodes[obje] = { name: this.labels[obje], face: OHOSLink };
                        this.edges[i] = { source: sub, target: obje, label: this.labels[pre] };
                        break;
                }
            }
        },
        draw_graph(fetched_data){
            this.fetched_data_copy = fetched_data.results.bindings;
            this.graph_status = this.graph_status.replace("Fetching data", "Drawing graph");
            console.log("Drawing graph...")
            var results = fetched_data.results.bindings;
            let obj = null;
            var sub = null;
            var pre = null;
            var obje = null;
            this.len = results.length;
            for (let i = 0; i < this.len; i++){
                obj = results[i];
                sub = obj.s.value;
                pre = obj.p.value;
                obje = obj.o.value;
                this.fetch_label(sub);
                this.fetch_label(obje);
                this.fetch_label(pre);      
            }
            this.graph_status = this.graph_status.delete;
            console.log("The graph should be ready. If it doesn't display, switch between tabs.")
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