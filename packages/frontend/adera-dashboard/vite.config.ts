import stylex from '@stylexjs/rollup-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      ...stylex({ fileName: 'assets/stylex-[hash].css', useCSSLayers: true, lightningcssOptions: { minify: true } }),
      transformIndexHtml(_, ctx) {
        const asset =
          ctx.bundle && Object.values(ctx.bundle).find((o) => o.type === 'asset' && o.fileName.includes('stylex'));

        if (asset) {
          const [tag, attrs] = ['link', { rel: 'stylesheet', crossorigin: true, href: `/${asset.fileName}` }];
          return [{ tag, attrs, injectTo: 'head' }];
        }
      }
    },
    svgr(),
    // система импортов TypeScript (иначе он игнорирует baseUrl)
    tsconfigPaths({ root: '.' })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0
        api: 'modern-compiler',
        // https://sass-lang.com/documentation/breaking-changes/mixed-decls/
        silenceDeprecations: ['mixed-decls']
      }
    }
  },
  // абсолютные импорты в SCSS-файлах
  resolve: { alias: { styles: '/src/styles' } }
});
