/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const merge = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(
  createDefaultConfig({
    input: path.resolve(__dirname, './index.html'),
  }),
  {
    output: {
      path: path.resolve(__dirname, '../../playground'),
    },
    resolve: {
      extensions: ['.ts', '.mjs', '.js', '.json'],
      alias: {
        stream: 'readable-stream',
      },
    },
    node: {
      crypto: true,
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'assets' },
        ],
      }),
    ],
  },
)
