const path = require('path')
const { DefinePlugin } = require('webpack')

const buildDir = process.env.BUILD_DIR || path.resolve(__dirname, 'build')
const origin = process.env.ORIGIN

if (!origin) {
  throw new Error('ORIGIN is required to build the extension')
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
      'process.env.ORIGIN': JSON.stringify(origin),
    }),
  ],
}

module.exports = webpackConfig
