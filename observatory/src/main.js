import { createApp } from 'vue'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"
import App from './App.vue'
//import dotenv from 'dotenv'

//require('dotenv').config()
//console.log(process.env)

const app = createApp(App)
app.use(VNetworkGraph)
app.mount('#app')

