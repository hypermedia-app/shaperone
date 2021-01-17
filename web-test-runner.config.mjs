import { esbuildPlugin } from '@web/dev-server-esbuild';
import rdfjs from 'rdfjs-eds-plugin'
import { fromRollup } from '@web/dev-server-rollup'
import commonjs from '@rollup/plugin-commonjs'

const immer = {
  resolveImport({ source }) {
    if (/immer/.test(source)) {
      return '/node_modules/immer/dist/immer.umd.development.js'
    }

    return undefined
  },
}
const config = {
  files: [
    "packages/hydra/test/**/*.test.ts",
    "packages/wc/test/**/*.test.ts",
    "packages/wc-material/test/**/*.test.ts",
    // "packages/wc-vaadin/test/**/*.test.ts"
  ],
  groups: [
    { name: 'hydra', files: 'packages/hydra/test/**/*.test.ts' },
    { name: 'wc', files: 'packages/wc/test/**/*.test.ts' },
    { name: 'wc-material', files: 'packages/wc-material/test/**/*.test.ts' },
  ],
  coverage: true,
  nodeResolve: true,
  concurrency: 1,
  plugins: [
    esbuildPlugin({ ts: true, js: true, target: 'auto' }),
    rdfjs,
    immer,
    fromRollup(commonjs)({
      exclude: [
        '**/node_modules/@open-wc/**/*',
        '**/node_modules/chai/**/*',
        '**/node_modules/chai-dom/**/*',
        '**/node_modules/sinon-chai/**/*',
      ]
    }),
  ],
};

if (process.env.CI) {
  delete config.concurrency
}

export default config
