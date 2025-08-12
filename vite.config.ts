import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // Enhanced browser compatibility
      target: ['es2015', 'chrome58', 'firefox57', 'safari11', 'edge16'],
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['lucide-react'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react',
        '@supabase/supabase-js',
      ],
    },
    server: {
      hmr: {
        overlay: false,
      },
    },
    // Add polyfills for better browser compatibility
    plugins: [
      {
        name: 'browser-compatibility',
        transformIndexHtml(html) {
          return html;
        },
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // Add CORS headers for better compatibility
            res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
            res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
            next();
          });
        }
      }
    ]
  };
});