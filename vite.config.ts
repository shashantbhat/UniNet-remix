import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
// import html from 'vite-plugin-html';
import tsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    // html({
    //
    // }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@mapbox/node-pre-gyp/lib/util/nw-pre-gyp/index.html',
          dest: 'assets'
        }
      ]
    }),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    exclude: ['@mapbox/node-pre-gyp'],
  },
});
