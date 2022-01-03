const path = require('path')

const webpackConfig = {
  entry: [
    path.resolve(__dirname, 'src', 'app', 'popup', 'popup.jsx')
  ],
  output: {
    filename: 'popup.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(s?css)$/,
        use: [
          // creates style nodes from JS strings
          'style-loader',
          // translates CSS into CommonJS
          'css-loader'
        ],
      }
    ],
  }
}

if (process.env.NODE_ENV === 'production') {
  webpackConfig.mode = 'production'
} else {
  webpackConfig.mode = 'development'
  webpackConfig.devtool = 'eval-cheap-module-source-map'
}

module.exports = webpackConfig
