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
            layouts: {},
            nodeLabel: {},
            nodeLabelObje: {},
            edgeLabel: {},
            refArrayNode: null,
            refNode: null,
            refArrayNodeObje: null,
            refNodeObje: null,
            refArrayEdge: null,
            refEdge: null,
                
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
            var OHOSLink = "https://ohos.ac.uk/wp-content/uploads/2021/12/cropped-OHOSIcon_Large.png"
            for (let i = 0; i < results.length; i++){
                let obj = results[i];
                var sub = obj.s.value;
                var pre = obj.p.value;
                var obje = obj.o.value;
                var imageCategory = ["P18","P109","P154","P41","P94","P948","P242","P1621","P2716","P3451","P4291","P8592","P2910"];
                this.refArrayNode = sub.split("/");
                this.refNode = this.refArrayNode[this.refArrayNode.length-1];
                /*fetch(
                      "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&origin=*&format=json&&formatversion=2&ids="+this.refNode,
                      {
                        method: "GET"
                      }
                    )
                      .then(response => response.json())
                      .then(response => (this.nodeLabel=response))
                      .then(response => {
                        console.log(this.nodeLabel.entities[this.refNode].labels.en.value);
                      })
                      .catch(error => {
                        console.log(error.message);
                      });
                */
                this.refArrayNodeObje = obje.split("/");
                this.refNodeObje = this.refArrayNodeObje[this.refArrayNodeObje.length-1];
                /*fetch(
                      "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&origin=*&format=json&&formatversion=2&ids="+this.refNodeObje,
                      {
                        method: "GET"
                      }
                    )
                      .then(response => response.json())
                      .then(response => (this.nodeLabelObje=response))
                      .then(response => {
                        console.log(this.nodeLabelObje.entities[this.refNodeObje].labels.en.value);
                      })
                      .catch(error => {
                        console.log(error.message);
                      });
                */
                this.refArrayEdge = pre.split("/");
                this.refEdge = this.refArrayEdge[this.refArrayEdge.length-1];
                /*fetch(
                      "https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&origin=*&format=json&&formatversion=2&ids="+this.refEdge,
                      {
                        method: "GET"
                      }
                    )
                      .then(response => response.json())
                      .then(response => (this.edgeLabel=response))
                      .then(response => {
                        console.log(this.edgeLabel.entities[this.refEdge].labels.en.value);
                      })
                      .catch(error => {
                        console.log(error.message);
                      });
                console.log(this.refEdge);
                console.log(this.edgeLabel.entities);
                console.log(this.edgeLabel.entities[this.refEdge].labels.en.value);
                */
                var edgeLabelIsImage = imageCategory.includes(this.refEdge);//this.edgeLabel.entities[this.refEdge].labels.en.value=="image";
                
                switch(true){
                    case(edgeLabelIsImage):
                        if(!this.nodes[sub] || this.nodes[sub].face == OHOSLink)
                            this.nodes[sub] = { name: this.refNode, face: obje };
                        else
                            if(this.nodes[sub])
                            {
                                this.nodes[obje] = { name: this.refNode, face: obje };
                                this.edges[i] = { source: sub, target: obje, label: this.refEdge };
                            }
                        break;
                    case(!edgeLabelIsImage):
                        switch(true){
                            case(!this.nodes[sub]):
                                this.nodes[sub] = { name: this.refNode, face: OHOSLink };
                                //if(!this.nodes[obje])
                                    this.nodes[obje] = { name: this.refNode, face: OHOSLink };
                                break;
                            case(this.nodes[sub]):
                                this.nodes[obje] = { name: this.refNode, face: OHOSLink };
                                break;
                        }
                        console.log(this.nodes[obje]);
                        console.log(obje);
                        console.log(sub);
                        console.log(this.refEdge);
                        this.nodes[obje] = { name: this.refNode, face: OHOSLink };
                        this.edges[i] = { source: sub, target: obje, label: this.refEdge };
                        break;
                }
                /*if(edgeLabelImage && !this.nodes[sub])
                    this.nodes[sub] = { name: this.nodeLabel.entities[this.refNode].labels.en.value, face: obje };
                else
                    {
                        if(this.edgeLabel.entities[this.refEdge].labels.en.value=="image" && this.nodes[sub])
                            this.nodes[sub] = { name: this.nodeLabel.entities[this.refNode].labels.en.value};
                        if(!this.edgeLabel.entities[this.refEdge].labels.en.value=="image" && this.nodes[sub])
                            this.nodes[sub] = { name: this.nodeLabel.entities[this.refNode].labels.en.value, face: "src\assets\ohos.png"};
                        if(this.edgeLabel.entities[this.refEdge].labels.en.value=="image")
                            this.nodes[obje] = { name: this.nodeLabel.entities[this.refNode].labels.en.value, face: obje};
                        else              
                            this.nodes[obje] = { name: this.nodeLabelObje.entities[this.refNodeObje].labels.en.value, face: "src\assets\ohos.png" };
                        this.edges[i] = { source: sub, target: obje, label: this.edgeLabel.entities[this.refEdge].labels.en.value };
                    }
                */
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
