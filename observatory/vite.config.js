import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    host: true,
    proxy:{
      '/foo':'http://ohos_observatory_kong:8000',
      '/api':{
        target:'http://ohos_observatory_kong:8000',
        changeOrigin:true,
        secure:false,
        ws:true,
        rewrite:(path)=>path.replace(/^\/api/, '')
      }
    }
  }
})
