import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup'
import commonjs from '@rollup/plugin-commonjs'

const immer = {
  resolveImport({ source }) {
    if (/immer/.test(source)) {
      return '/node_modules/immer/dist/immer.umd.development.js'
    }

    return undefined
  },
  transform(context) {
    return context.body.replace('{ produce }', 'produce')
  },
}

const config = {
  groups: [
    { name: 'hydra', files: 'packages/hydra/test/**/*.test.ts' },
    { name: 'wc', files: 'packages/wc/test/**/*.test.ts' },
    { name: 'wc-material', files: 'packages/wc-material/test/**/*.test.ts' },
    { name: 'wc-vaadin', files: 'packages/wc-vaadin/test/**/*.test.ts' },
    { name: 'wc-shoelace', files: 'packages/wc-shoelace/test/**/*.test.ts' },
  ],
  coverage: true,
  nodeResolve: {
    exportConditions: ['browser', 'module', 'import', 'default'],
  },
  concurrency: 1,
  plugins: [
    esbuildPlugin({ ts: true, js: true, target: 'auto', tsconfig: 'tsconfig.json' }),
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
