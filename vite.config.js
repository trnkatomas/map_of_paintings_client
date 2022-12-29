import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/wiki-search": {
        target: "https://wikidata.org",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wiki-search/, ""),
      },
      "/wiki-data": {
        target: "https://query.wikidata.org",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wiki-data/, ""),
      }
    },
  },
})
