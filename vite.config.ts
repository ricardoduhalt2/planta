import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './',
    plugins: [react()],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'src')
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
      include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei']
    },
    server: {
      port: 3000,
      open: true,
      host: true,
      cors: true,
      strictPort: true
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three', 'three/examples/jsm/controls/OrbitControls'],
            react: ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  };
});
