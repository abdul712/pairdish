// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // SSR mode for Cloudflare Workers
  output: 'server',
  
  // Production domain
  site: 'https://pairingplates.com',
  
  // Integrations
  integrations: [react()],
  
  // Cloudflare adapter
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'cloudflare',
  }),
  
  // Vite configuration
  vite: {
    plugins: [tailwindcss()],
    ssr: { external: ['node:async_hooks'] },
    resolve: {
      // Required for React 19 on Cloudflare Workers
      alias: process.env.NODE_ENV === 'production' ? {
        'react-dom/server': 'react-dom/server.edge'
      } : {},
      // Prevent duplicate React instances
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  }
});