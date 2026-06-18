// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** @returns {import('astro').AstroIntegration} */
const pwaVersionPlugin = () => ({
  name: 'pwa-version-plugin',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const swUrl = new URL('sw.js', dir);
      const swPath = fileURLToPath(swUrl);
      try {
        let content = await fs.readFile(swPath, 'utf-8');
        const uniqueVersion = `foodie-static-${Date.now()}`;
        content = content.replace(/const\s+CACHE_NAME\s*=\s*['"`][^'"`]+['"`];/, `const CACHE_NAME = '${uniqueVersion}';`);
        await fs.writeFile(swPath, content, 'utf-8');
        console.log(`[PWA Plugin] Updated CACHE_NAME in sw.js to: ${uniqueVersion}`);
      } catch (err) {
        console.error('[PWA Plugin] Failed to update sw.js version:', err);
      }
    }
  }
});

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [pwaVersionPlugin()],
  vite: {
    plugins: [tailwindcss()],
  },
});