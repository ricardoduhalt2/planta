import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: './',
    plugins: [
      react(),
      nodePolyfills({
        // Enable polyfills for the browser
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        // Enable polyfills for Node.js built-ins
        protocolImports: true,
      }),
    ],
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
        // Enable esbuild polyfill for IntersectionObserver
        define: {
          global: 'globalThis',
        },
      },
      include: [
        'react',
        'react-dom',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        'intersection-observer'
      ],
      exclude: ['@tweenjs/tween.js']
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
