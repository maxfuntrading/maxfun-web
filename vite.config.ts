import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcDir,
    }
  },
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'backend',
    //     changeOrigin: true,
    //   }
    // }
  }
})
