import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import * as child from 'child_process';

const commitDate = child
  .execSync('git log -1 --format=%cI')
  .toString()
  .trimEnd();
const branchName = child
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trimEnd();
const commitHash = child
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trimEnd();

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __BUILD_DATE__: JSON.stringify(
      new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, '.')
        .replace('T', ' '),
    ),
    __COMMIT_HASH__: JSON.stringify(commitHash),
    __COMMIT_DATE__: JSON.stringify(
      new Date(commitDate)
        .toISOString()
        .slice(0, 19)
        .replace(/-/g, '.')
        .replace('T', ' '),
    ),
    __BRANCH_NAME__: JSON.stringify(branchName),
  },
  plugins: [react()],
  server: {
    open: true,
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/admin': {
        secure: false,
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
      },
      '/api': {
        secure: false,
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
      },
      '/api-auth': {
        secure: false,
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
      },
      '/static': {
        secure: false,
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@mui': path.resolve(__dirname, './node_modules/@mui'),
      '@': path.resolve(__dirname, './src'),
      '@mui/material': '@mui/joy',
    },
  },
  build: {
    assetsDir: 'static/assets',
    emptyOutDir: true,
  },
});
