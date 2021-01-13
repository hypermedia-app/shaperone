const path = require('path')
const config = require('../../webpack.config')

module.exports = (env, { mode }) => config({
  input: path.resolve(__dirname, './demo/index.html'),
  output: path.resolve(__dirname, '../../dist/shaperone-form'),
  publicPath: mode === '' ? 'shaperone-form' : '',
  options: {
    webpackIndexHTMLPlugin: {
      minify: false,
    },
  },
})
