/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma')
const merge = require('deepmerge')
const cjsTransformer = require('es-dev-commonjs-transformer')

module.exports = (config) => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'packages/wc-material/test/**/*.test.ts', type: 'module' },
      ],

      basePath: '../../',

      coverageIstanbulReporter: {
        reports: ['json'],
        thresholds: null,
      },

      esm: {
        babel: true,
        nodeResolve: true,
        fileExtensions: ['.ts'],
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
