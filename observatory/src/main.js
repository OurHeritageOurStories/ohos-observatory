import { createApp } from 'vue'
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"
import App from './App.vue'
import lodash from 'lodash'

const app = createApp(App)
app.use(VNetworkGraph)
app.use(lodash)
app.mount('#app')

