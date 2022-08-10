<script lang="ts">

import TableLite from "../components/TableLite.vue";
import { defineComponent, reactive, computed, ref } from "vue"
import * as vNG from "v-network-graph"
import {
  ForceLayout,
  ForceNodeDatum,
  ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"
import LoadDataVue from "./LoadData.vue";
import CommonFunctions from "./CommonFunctions.vue";

export default{
    components: { TableLite },
    /* setup()
        {
            const relatedData = reactive([]);
            const table = reactive({
              columns: [
                {
                  label: "Subject",
                  field: "subject",
                  width: "3%",
                  sortable: true,
                  isKey: true,
                },
                {
                  label: "Predicate",
                  field: "predicate",
                  width: "10%",
                  sortable: true,
                },
                {
                  label: "Object",
                  field: "object",
                  width: "15%",
                  sortable: true,
                },
              ],
              rows: relatedData,
              totalRecordCount: computed(() => {
                return table.rows.length;
              }),
              sortable: {
                order: "predicate",
                sort: "asc",
              },
            });
            return {
              table,
            };
        }, */
    data(){
        return{
            items: null,
            label: null,
            relatedData: reactive([]),
            table: reactive({
              columns: [
                {
                  label: "Subject",
                  field: "subject",
                  width: "3%",
                  sortable: true,
                  isKey: true,
                },
                {
                  label: "Predicate",
                  field: "predicate",
                  width: "10%",
                  sortable: true,
                },
                {
                  label: "Object",
                  field: "object",
                  width: "15%",
                  sortable: true,
                },
              ],
              rows: this.relatedData,
              sortable: {
                order: "predicate",
                sort: "asc",
              },
            }), 
            relatedJSON: null,
            graph_status: "Select data in the Select tab please",          
            playground_data:null,
            nodes: {},
            edges: {},
            labels: {},
            layouts: {},
            len: null,
            count: 0,
            fetched_data_copy: null,
            node_limit: localStorage.getItem("nodeLimit"),
            componentKey: 0,
            zoomLevel: ref(0.7),
            configs: reactive(
              vNG.defineConfigs({
                view: {
                  scalingObjects: true,
                  autoPanAndZoomOnLoad: "fit-content",
                  layoutHandler: new ForceLayout({
                    positionFixedByDrag: false,
                    positionFixedByClickWithAltKey: true,
                  }),
                },
                node: {
                  normal: {
                    radius: 12,
                    color: "#b3bdee",
                    strokeWidth: 5,
                    strokeColor: "#b3bdee",
                  },
                  label: {
                    visible: true,
                    margin: 0,    
                  }
                },
                edge: {
                  normal: {
                    width: 1,
                    color: "#b3bdee",
                  },
                  gap: 50,
                  type: "curve",
                  marker: {
                    target: {
                      type: "arrow",
                    }
                  },
                  label: {
                    fontSize: 9,
                    background: {
                      visible: true,
                      color: "#f7fafa",
                    },                    
                  }
                },
              })
            ),
            eventHandlers: {
              "node:click": ({ node }) => {
                var promise = this.fetch_related_promise(node);
                promise.then(
                    (result)=>{
                        this.relatedData = reactive([]);
                        this.relatedJSON = result;
                        this.publish_table(this.relatedData);
                    },
                    (error)=>{
                        throw "Error: " + error;
                    }
                );
              },
            }
        };
    },
    created(){
        this.create_graph()
    },
    methods:{
        publish_table(relatedData)
        {
            let sub = ""
            let link = this.relatedJSON.results.bindings[0].oo.value;
            var refArray = link.split("/");
            switch(link.includes("wikidata.org/")){
                case true:
                    var ref =  refArray[refArray.length-1];
                    var promise = this.fetch_label_promise(ref, link);
                    promise.then(
                        (result)=>{
                            sub = result.entities[ref].labels.en.value;
                        },
                        (error)=>{
                            throw "Error: " + error;
                        }
                    );
                    break;    
            }
            this.items = {};
            for (let i = 0; i < this.relatedJSON.results.bindings.length; i++) {
                this.items[this.relatedJSON.results.bindings[i].op.value] = this.relatedJSON.results.bindings[i].o.value;
                //let label = ""
                let link = this.relatedJSON.results.bindings[i].s.value;
                //var refArray = link.split("/");
                //switch(link.includes("wikidata.org/")){
                //    case true:
                //        var ref =  refArray[refArray.length-1];
                //        var promise = this.fetch_label_promise(ref, link);
                //        promise.then(
                //            (result)=>{
                                this.items[this.relatedJSON.results.bindings[i].a.value] = link;
                                console.log(this.relatedJSON.results.bindings[i].a.value, link);
                //            },
                //            (error)=>{
                //                throw "Error: " + error;
                //            }
                //        );
                //        break;    
                //}
            }
            for (const [key, value] of Object.entries(this.items)) {
            let label = ""
            let link = key;
            var refArray = link.split("/");
            switch(link.includes("wikidata.org/")){
                    case true:
                        var ref =  refArray[refArray.length-1];
                        var promise = this.fetch_label_promise(ref, link);
                        var pred = "";
                        promise.then(
                            (result)=>{
                                console.log(result);
                                pred = result.entities[ref].labels.en.value;
                                relatedData.push({
                                subject: sub,
                                predicate: pred,
                                object: value,
                              });
                            },
                            (error)=>{
                                throw "Error: " + error;
                            }
                        );
                        break;    
                    case false:
                        relatedData.push({
                            subject: sub,
                            predicate: key,
                            object: value,
                          });
                          break;
                }
            
            }
            this.table["rows"] = relatedData;
            
        },
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
        fetch_related_promise(link){
          var refArray = link.split("/");
          var ref =  refArray[refArray.length-1];  
          let label = null;
          let endpoint = 'https://query.wikidata.org/sparql';
          let sparqlQuery = "SELECT DISTINCT ?op ?o ?oo ?a ?s  WHERE { " +
            "SERVICE <http://dbpedia.org/sparql>  {<http://dbpedia.org/resource/" + ref + "> ?op ?o. " +
            "<http://dbpedia.org/resource/" + ref + "> owl:sameAs ?oo " +
            "filter( regex(str(?oo), 'wikidata' ) && (LANG(?o) = 'en' || LANG(?o) = ''))} " +
            "SERVICE <https://query.wikidata.org/sparql>{ ?oo ?a ?s.}}";
          let fullUrl = endpoint + '?query=' + encodeURIComponent( sparqlQuery );
          let headers = { 'Accept': 'application/sparql-results+json' };
          let promise = new Promise(function (resolve, reject){
              fetch( fullUrl, { headers } )
                    .then(response => response.json())
                    .then(response => (label = response))
                    .then(response => {
                      resolve(response);
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
                    switch(link.includes("dbpedia.org/")){
                        case true:
                            var ref =  refArray[refArray.length-1];
                            var promise = CommonFunctions.fetch_image_promise(ref);
                            this.labels[link] = link.replace("http://dbpedia.org/resource/", "").replace(":", "").replace(/_/g, " ").replace("//xmlns.com/foaf/0.1/", "");
                            promise.then(
                                (result)=>{
                                    this.count = this.count + 1;
                                    if (result.results.bindings.length)
                                        this.nodes[link] = {name: this.labels[link], face: result.results.bindings[0].i.value };
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
                            this.labels[link] = link.replace("http://dbpedia.org/resource/", "").replace(":", "").replace(/_/g, " ").replace("//xmlns.com/foaf/0.1/", "");
                            this.count = this.count + 1;
                            if(this.count == this.len*3)
                                    {
                                        this.make_connections();
                                    }
                            return link;
                            break;
                    }

                    
            }
        },
        fetch_related_label(link){
            var refArray = link.split("/");
            switch(link.includes("wikidata.org/")){
                case true:
                    var ref =  refArray[refArray.length-1];
                    var promise = this.fetch_label_promise(ref, link);
                    promise.then(
                        (result)=>{
                            label = result.entities[ref].labels.en.value;
                        },
                        (error)=>{
                            throw "Error: " + error;
                        }
                    );
                    break;    
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
                this.nodes[sub].name = this.labels[sub];
            }
        },
        draw_graph(fetched_data){
            this.fetched_data_copy = fetched_data.results.bindings;
            this.graph_status = "Drawing graph...";
            console.log("Drawing graph...")
            var results = fetched_data.results.bindings;
            console.log(results);
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
            this.graph_status = "";
            console.log("The graph should be ready. If it doesn't display, switch between tabs.")
        },
        create_graph(){
            localStorage.setItem("nodeLimit", this.node_limit);
            this.componentKey += 1;
            this.graph_status = "Fetching data... If this message disappears but the graph doesn't show within a few seconds, switch between tabs";
            if (isNaN(this.node_limit)){
                this.node_limit = 100;
            }
            fetch('api/graph?query=SELECT * {?s ?p ?o} LIMIT ' + this.node_limit,{
                headers:{"Accept":"application/sparql-results+json"}
            })
                .then(response=>response.json())
                .then(response=>(this.post=response))
                .then(response=>this.draw_graph(response));
    }
    }
}

</script>

<template>
<div id="graphStatus" style="font-size:12px;">{{ graph_status }}</div>
<div id="zoomStatus">
    <label style="font-size:12px;">Set zoom level  </label>
    <input type="range" v-model="zoomLevel" min="0.4" max="5" step="0.1" class="slider">
</div>
<v-network-graph
    v-model:zoom-level="zoomLevel"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs"
    :layers="layers"
    :event-handlers="eventHandlers"
    :key="componentKey"
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
  <div id="nodeLimit">
  <label style="font-size:12px;">Set max nodes: {{ node_limit }}  </label>
  <input  type="range" v-model="node_limit" id="node_limit" min="1" max="200" class="slider"/>
  <button @click="create_graph" id="node_limit_button" class="button">Refresh</button>
  <span style="font-size:12px;">The limit might not be precise. If the graph appears odd, switch between tabs.</span>
  </div>
  <table-lite
    :is-static-mode="fals3"
    :columns="table.columns"
    :rows="table.rows"
    :sortable="table.sortable"
  ></table-lite>
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