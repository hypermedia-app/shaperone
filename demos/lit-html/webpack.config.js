/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const merge = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')

module.exports = merge(
  createDefaultConfig({
    input: path.resolve(__dirname, './index.html'),
  }),
  {
    output: {
      path: path.resolve(__dirname, '../../docs/lit-html'),
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
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
  },
)
