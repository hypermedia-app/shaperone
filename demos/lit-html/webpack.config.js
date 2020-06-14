/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const merge = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')

const plugins = []
if (process.env.BUNDLE_ANALYZER_TOKEN) {
  const BundleAnalyzerPlugin = require('@bundle-analyzer/webpack-plugin')

  plugins.push(new BundleAnalyzerPlugin({ token: process.env.BUNDLE_ANALYZER_TOKEN }))
}

module.exports = merge(
  createDefaultConfig({
    input: path.resolve(__dirname, './index.html'),
  }),
  {
    output: {
      path: path.resolve(__dirname, '../../playground'),
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        stream: 'readable-stream',
      },
    },
    plugins,
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
