const path = require('path')
const { DefinePlugin } = require('webpack')

const buildDir = process.env.BUILD_DIR || path.resolve(__dirname, 'build')
const proxyOrigin = process.env.PROXY_ORIGIN

if (!proxyOrigin) {
  throw new Error('PROXY_ORIGIN is required to build the extension')
}

const webpackConfig = {
  entry: [
    path.resolve(__dirname, 'src', 'app', 'background.js')
  ],
  output: {
    filename: 'background.min.js',
    path: buildDir,
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  mode: 'production',
  plugins: [
    new DefinePlugin({
      'process.env.PROXY_ORIGIN': JSON.stringify(proxyOrigin),
    }),
  ],
}

module.exports = webpackConfig
