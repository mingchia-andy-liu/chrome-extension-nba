const path = require('path')

const buildDir = process.env.BUILD_DIR || path.resolve(__dirname, 'build')

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
  mode: 'production'
}

module.exports = webpackConfig
