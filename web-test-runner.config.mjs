import { esbuildPlugin } from '@web/dev-server-esbuild'
import { fromRollup } from '@web/dev-server-rollup'
import commonjs from '@rollup/plugin-commonjs'
import { puppeteerLauncher } from '@web/test-runner-puppeteer'

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

const rdx = {
  resolveImport({ source }) {
    if(/@captaincodeman\/rdx/.test(source)) {
      return '/packages/rdx/src/index.ts'
    }
  }
}

const config = {
  groups: [
    { name: 'hydra', files: 'packages/hydra/test/**/*.test.ts' },
    { name: 'core', files: 'packages/shaperone/test/**/*.test.ts' },
    { name: 'vaadin', files: 'packages/vaadin/test/**/*.test.ts' },
    { name: 'shoelace', files: 'packages/shoelace/test/**/*.test.ts' },
  ],
  coverage: true,
  nodeResolve: {
    browser: true,
    modulePaths: ['packages'],
  },
  concurrency: 1,
  plugins: [
    esbuildPlugin({ ts: true, js: true, target: 'auto', tsconfig: 'tsconfig.json' }),
    immer,
    rdx,
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
  config.browsers = [
    puppeteerLauncher({
      launchOptions: {
        args: ['--no-sandbox'],
      },
    }),
  ]
  delete config.concurrency
}

export default config
