/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const merge = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')
const BundleAnalyzerPlugin = require('@bundle-analyzer/webpack-plugin')

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
      alias: {
        stream: 'readable-stream',
      },
    },
    plugins: [
      new BundleAnalyzerPlugin({ token: process.env.BUNDLE_ANALYZER_TOKEN }),
    ],
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
