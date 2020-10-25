/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const config = require('../../webpack.config')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = config({
  input: path.resolve(__dirname, './index.html'),
  output: path.resolve(__dirname, '../../playground'),
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'assets' },
      ],
    }),
  ],
})
