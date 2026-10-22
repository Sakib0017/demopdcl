import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true, // Enable source maps for better debugging and PageSpeed insights
    rollupOptions: {
      treeshake: true,
      output: {
        // Ensure proper MIME types for module scripts
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Add proper module format
        format: 'es'
      }
    },
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.warn'] : []
      },
      mangle: {
        safari10: true
      }
    },
    // Performance optimizations
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none' // Remove legal comments for smaller bundle
  },
  // Optimize deps for better performance
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'framer-motion',
      'react-spring'
    ]
  }
})
