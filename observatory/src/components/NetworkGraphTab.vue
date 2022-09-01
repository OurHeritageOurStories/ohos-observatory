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
import lodash from 'lodash';

export default{
    components: { TableLite },
    data(){
        return{
            items: null,
            label: null,
            relatedData: reactive([]),
            props: reactive(["http://dbpedia.org/ontology/ceremonialCounty", "http://dbpedia.org/ontology/deathPlace", "http://dbpedia.org/ontology/birthPlace", "http://dbpedia.org/ontology/country", "http://dbpedia.org/ontology/WikiPageExternalLink", "http://dbpedia.org/ontology/region", "rdfs:comment", "geo:lat", "geo:long", "foaf:depiction", "http://dbpedia.org/ontology/birthPlace", "http://dbpedia.org/ontology/deathPlace", "http://dbpedia.org/ontology/officialName", "http://www.wikidata.org/prop/direct/P18", "http://www.wikidata.org/prop/direct/P21", "http://www.wikidata.org/prop/direct/P27", "http://www.wikidata.org/prop/direct/P569", "http://www.wikidata.org/prop/direct/P19", "http://www.wikidata.org/prop/direct/P570", "http://www.wikidata.org/prop/direct/P20", "http://www.wikidata.org/prop/direct/P22", "http://www.wikidata.org/prop/direct/P25", "http://www.wikidata.org/prop/direct/P26", "http://www.wikidata.org/prop/direct/P40", "http://www.wikidata.org/prop/direct/P106", "http://www.wikidata.org/prop/direct/P69", "http://www.wikidata.org/prop/direct/P641", "http://www.wikidata.org/prop/direct/P607", "http://www.wikidata.org/prop/direct/P241", "http://www.wikidata.org/prop/direct/P166", "http://www.wikidata.org/prop/direct/P17", "http://www.wikidata.org/prop/direct/P7959", "http://dbpedia.org/ontology/award", "http://dbpedia.org/ontology/battle", "http://dbpedia.org/ontology/militaryBranch", "http://dbpedia.org/ontology/restingPlace", "http://dbpedia.org/ontology/serviceEndYear", "http://dbpedia.org/ontology/serviceStartYear", "http://dbpedia.org/ontology/relation", "http://dbpedia.org/ontology/thumbnail", "http://dbpedia.org/prop/birthDate", "http://dbpedia.org/prop/birthName", "http://dbpedia.org/prop/birthPlace", "http://dbpedia.org/prop/rank", "http://dbpedia.org/prop/deathDate", "http://dbpedia.org/prop/deathPlace", "http://dbpedia.org/prop/placeofburial"]),
            table: reactive({
              columns: [
                {
                  label: "Relation",
                  field: "predicate",
                  width: "10%",
                  sortable: true,
                },
                {
                  label: "Entity",
                  field: "object",
                  width: "15%",
                  sortable: true,
                },
              ],
              totalRecordCount: 0,
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
            len2: null,
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
                    color: node => node.color,
                    strokeWidth: 5,
                    strokeColor: node => node.color,
                  },
                  label: {
                    visible: true,
                    margin: 0,    
                  }
                },
                edge: {
                  normal: {
                    width: 1,
                    color: edge => edge.color,
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
                var promise = this.fetch_related_dbpedia_promise(node);
                promise.then(
                    (result)=>{
                        this.relatedData = reactive([]);
                        this.relatedJSON = result;
                        this.publish_table(this.relatedData, node, "dbpedia");
                        var val = "";
                        if(this.relatedJSON.results.bindings[0])
                            val = this.relatedJSON.results.bindings[0].oo.value;
                        else 
                            val = node;
                        {
                            promise = this.fetch_related_wikidata_promise(node, val);
                            promise.then(
                                (result)=>{
                                    this.relatedJSON = result;
                                    console.log(!this.relatedJSON.results.bindings[0])
                                    console.log(val == node)
                                    if(this.relatedJSON.results.bindings[0] && val == node)
                                        alert("No more possible expansion");
                                    this.publish_table(this.relatedData, node, "wikidata");
                                },
                                (error)=>{
                                    throw "Error: " + error;
                                }
                            );
                        }
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
        publish_table(relatedData, node, source)
        {
            this.items = {};
            for (let ii = 0; ii < this.relatedJSON.results.bindings.length; ii++) {
                var objectLabel = "";
                if("lo" in this.relatedJSON.results.bindings[ii])
                    objectLabel = this.relatedJSON.results.bindings[ii].lo.value;
                else
                    objectLabel = this.relatedJSON.results.bindings[ii].o.value;
                if("i" in this.relatedJSON.results.bindings[ii])
                    this.items[this.relatedJSON.results.bindings[ii].oopLabel.value] = [this.relatedJSON.results.bindings[ii].i.value, objectLabel, this.relatedJSON.results.bindings[ii].o.value];
                else
                    this.items[this.relatedJSON.results.bindings[ii].oopLabel.value] = ["https://ohos.ac.uk/wp-content/uploads/2021/12/cropped-OHOSIcon_Large.png", objectLabel, this.relatedJSON.results.bindings[ii].o.value];
            }
            for (const [key, value] of Object.entries(this.items)) {
            let label = ""
            let link = key;
            var colour = "";
            if (source == "dbpedia")
                colour = "#fed32c";
            else
                colour = "#990000";
            var refArray = link.split("/");
            switch(link.includes("wikidata.org/")){
                    case true:
                        var ref =  refArray[refArray.length-1];
                        var promise = this.fetch_label_promise(ref, link);
                        var pred = "";
                        promise.then(
                            (result)=>{
                                var retRef = Object.keys(result.entities)[0];
                                pred = result.entities[retRef].labels.en.value;
                                if(this.props.includes(key))
                                {
                                    this.nodes[value[2]] = { name: value[1], face: value[0], color: colour };
                                    this.edges[key] = { source: node, target: value[2], label: pred, color: colour };
                                }
                                relatedData.push({
                                predicate: pred,
                                object: value[1],
                              });
                            },
                            (error)=>{
                                throw "Error: " + error;
                            }
                        );
                        break;    
                    case false:
                        var pred = key;
                        var predArray =  pred.split("/");
                        pred = lodash.startCase(predArray[predArray.length-1]);
                        if(this.props.includes(key))
                        {
                            this.nodes[value[2]] = { name: value[1], face: value[0], color: colour };
                            this.edges[key] = { source: node, target: value[2], label: pred, color: colour };
                        }
                        relatedData.push({
                            predicate: pred,
                            object: value[1],
                          });
                          break;
                }
            
            }
            this.table["rows"] = relatedData;
            this.table["totalRecordCount"] = relatedData.length;
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
        fetch_related_dbpedia_promise(link){
          var refArray = link.split("/");
          var ref =  refArray[refArray.length-1];  
          let label = null;
          let endpoint = 'https://query.wikidata.org/sparql';
          let sparqlQuery = "SELECT  DISTINCT ?oo ?oopLabel ?o ?lo ?lop ?i WHERE { " + 
          "SERVICE <http://dbpedia.org/sparql>  {<http://dbpedia.org/resource/"+ref+"> ?oopLabel ?o. " + 
          "<http://dbpedia.org/resource/"+ref+"> owl:sameAs ?oo." +
          "?oopLabel rdfs:label ?lop." +
          "FILTER(regex(str(?oo), 'wikidata' ) && (LANG(?lop)='en' || LANG(?lop)='')) " +
          "MINUS{<http://dbpedia.org/resource/"+ref+"> ?oopLabel ?o. " +
          "FILTER(LANG(?o)!='en' && LANG(?o)!='')} " +
          "OPTIONAL{<http://dbpedia.org/resource/"+ref+"> ?oopLabel ?o. " +
          "?o rdfs:label ?lo. " +
          "?o <http://dbpedia.org/ontology/thumbnail> ?i " +
          "FILTER((LANG(?lo)='en' || LANG(?lo)=''))}}}";
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
      fetch_related_wikidata_promise(link, wikiLink){
          var refArray = link.split("/");
          var ref =  refArray[refArray.length-1];  
          let label = null;
          let endpoint = 'https://query.wikidata.org/sparql';
          let sparqlQuery = "SELECT  ?oop ?oopLabel ?o ?pLabel ?lo ?i WHERE { " +
 "<"+wikiLink+"> ?oop ?o.  " +
  "SERVICE wikibase:label { bd:serviceParam wikibase:language 'en'. }  " +
  "?p wikibase:directClaim ?oop . " +
  "?o rdfs:label ?lo . " +
  "filter( (LANG(?lo) = 'en' || LANG(?lo) = '')) }  ";
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
                                        this.nodes[link] = {name: this.labels[link], face: result.results.bindings[0].i.value, color: "#e7d2ea" };
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
                            this.nodes[sub] = { name: this.labels[sub], face: obje, color: "#e7d2ea" };
                        else
                            if(this.nodes[sub])
                            {
                                this.nodes[obje] = { name: this.labels[obje], face: obje, color: "#e7d2ea" };
                                this.edges[i] = { source: sub, target: obje, label: this.labels[pre], color: "#e7d2ea" };
                            }
                        break;
                    case(!edgeLabelIsImage):
                        switch(true){
                            case(!this.nodes[sub]):
                                this.nodes[sub] = { name: this.labels[sub], face: OHOSLink, color: "#e7d2ea" };
                                    this.nodes[obje] = { name: this.labels[obje], face: OHOSLink, color: "#e7d2ea" };
                                break;
                            case(this.nodes[sub]):
                                this.nodes[obje] = { name: this.labels[obje], face: OHOSLink, color: "#e7d2ea" };
                                break;
                        }
                        this.nodes[obje] = { name: this.labels[obje], face: OHOSLink, color: "#e7d2ea" };
                        this.edges[i] = { source: sub, target: obje, label: this.labels[pre], color: "#e7d2ea" };
                        break;
                }
                this.nodes[sub].name = this.labels[sub];
            }
        },
        draw_graph(fetched_data){
            this.fetched_data_copy = fetched_data.results.bindings;
            this.graph_status = "Drawing graph...";
            console.log("Drawing graph...");
            var results = fetched_data.results.bindings;
            this.len = results.length;
            this.len2 = this.len;
            for (let i = 0; i < this.len; i++){
                this.fetch_label(results[i].s.value);
                this.fetch_label(results[i].o.value);
                this.fetch_label(results[i].p.value);      
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
            fetch('api/graph?query=SELECT DISTINCT ?s ?p ?o WHERE { BIND(<http://dbpedia.org/resource/Spratton> AS ?s) <http://dbpedia.org/resource/Spratton> ?p ?o.}' ,{
                headers:{"Accept":"application/sparql-results+json"}
            })
                .then(response=>response.json())
                .then(response=>(this.post=response))
                .then(response=>this.draw_graph(response));
            fetch('api/graph?query=SELECT DISTINCT ?s ?p ?o WHERE { <http://dbpedia.org/resource/Spratton> ?p1 ?s. ?s ?p ?o.}' ,{
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
  <div>
    <p>Legends</p>
    <p style = "color:#e7d2ea">
        OHOS
    </p>
    <p class = "line OHOSLine"></p>
    <p style = "color:#fed32c">
        DBPedia
    </p>
    <p class = "line DBPediaLine"></p>
    <p style = "color:#990000">
        WikiData
    </p>
    <p class = "line WikiDataLine"></p>
  </div>
  <table-lite
    :is-static-mode="true"
    :columns="table.columns"
    :rows="table.rows"
    :total="table.totalRecordCount"
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
p.OHOSLine:after {
    background-color: #e7d2ea;
    content: "";
    display: inline-block;
    height: 5px;
    position: relative;
    vertical-align: middle;
    width: 5%;
}
p.DBPediaLine:after {
    background-color: #fed32c;
    content: "";
    display: inline-block;
    height: 5px;
    position: relative;
    vertical-align: middle;
    width: 5%;
}
p.WikiDataLine:after {
    background-color: #990000;
    content: "";
    display: inline-block;
    height: 5px;
    position: relative;
    vertical-align: middle;
    width: 5%;
}

</style>