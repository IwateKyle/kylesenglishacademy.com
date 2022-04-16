import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  assetsInclude: ['**/*.gltf', '**/*.json', '**/*.png'],
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
});
