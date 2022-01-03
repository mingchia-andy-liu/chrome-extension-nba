const path = require('path')

const webpackConfig = {
  entry: [
    path.resolve(__dirname, 'src', 'app', 'background.js')
  ],
  output: {
    filename: 'background.min.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.js'],
  },
  mode: 'production'
}

module.exports = webpackConfig
