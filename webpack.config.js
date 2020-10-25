/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')

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
      extensions: ['.ts', '.mjs', '.js', '.json'],
      alias: {
        stream: 'readable-stream',
      },
    },
    module: {
      rules: [
        {
          test: /\.nq$/,
          use: ['raw-loader'],
        },
        {
          test: /\.ttl$/,
          use: ['raw-loader'],
        },
      ],
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
