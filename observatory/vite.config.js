import { fileURLToPath, URL } from 'url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

//export default ({mode}) => {
//  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
//  return defineConfig({
//    plugins:[vue()],
//    resolve:{
//      alias:{
//        '@': fileURLToPath(new URL('./src', import.meta.url))
//      }
//    },
//    server:{
//      host:true,
//      proxy:{
//        '/foo':process.env.VITE_API_ENDPOINT,
//        '/api':{
//          target:process.env.VITE_API_ENDPOINT,
//          changeOrigin:true,
//          secure:false,
//          ws:true,
//          rewrite:(path)=>path.replace(/^\/api/, '')
//        }
//      }
//    }
//  })
//}

//https://vitejs.dev/config/
export default defineConfig({
  base:'',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //envDir:'./',
  server:{
    host: "0.1.2.3",
    proxy:{
      //'/foo':'http://ohos_observatory_kong:8000',
      '/foo':'ohos_observatory_kong:8000',
      //'/foo':import.meta.env.VITE_API_ENDPOINT,
      //'/foo':import.meta.env.VITE_API_ENDPOINT,
      '/api':{
        //target:'http://ohos_observatory_kong:8000',
        target:'ohos_observatory_kong:8000',
        //target: import.meta.env.VITE_API_ENDPOINT,
        //target:import.meta.env.VITE_API_ENDPOINT,
        changeOrigin:true,
        secure:false,
        ws:true,
        //rewrite:(path)=>path.replace(/^\/api/, '')
      }
    }
  }
})
