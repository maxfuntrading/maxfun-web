import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': srcDir,
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_HOST,
          changeOrigin: true,
        }
      }
    }
  }
})
