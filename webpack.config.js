/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')
const ResolveTypeScriptPlugin = require('resolve-typescript-plugin')

module.exports = ({ input, output, contentBase, publicPath, options = {} }) => merge(
  createDefaultConfig({
    input,
    ...options,
  }),
  {
    output: {
      path: output,
      publicPath,
    },
    resolve: {
      plugins: [new ResolveTypeScriptPlugin()],
      extensions: ['.ts', '.mjs', '.js', '.json'],
      alias: {
        stream: 'readable-stream',
      },
    },
    node: {
      crypto: true,
    },
    devServer: {
      contentBase,
      watchContentBase: true,
    },
  },
)
