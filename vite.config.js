import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ryno',
        short_name: 'Ryno',
        description: 'Free Fire Tournament Platform',
        theme_color: '#f59e0b',
        icons: [{ src: '/ryno-icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    }),
  ],
});
