/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma')
const merge = require('deepmerge')
const cjsTransformer = require('es-dev-commonjs-transformer')
const rdfjs = require('rdfjs-eds-plugin')

module.exports = (config) => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        { pattern: config.grep ? config.grep : 'packages/wc-material/test/**/*.test.ts', type: 'module' },
        { pattern: config.grep ? config.grep : 'packages/wc-vaadin/test/**/*.test.ts', type: 'module' },
      ],

      coverageIstanbulReporter: {
        reports: ['json'],
        thresholds: null,
        dir: 'coverage/karma',
      },

      esm: {
        babel: true,
        nodeResolve: true,
        fileExtensions: ['.ts'],
        plugins: [rdfjs],
        responseTransformers: [
          cjsTransformer([
            '**/node_modules/@open-wc/**/*',
            '**/node_modules/chai/**/*',
            '**/node_modules/chai-dom/**/*',
            '**/node_modules/sinon-chai/**/*',
          ]),
        ],
      },
    }),
  )
  return config
}
