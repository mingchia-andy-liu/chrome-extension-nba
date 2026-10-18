const path = require('path')
const { DefinePlugin } = require('webpack')

const buildDir = process.env.BUILD_DIR || path.resolve(__dirname, 'build')
const origin = process.env.ORIGIN

if (!origin) {
  throw new Error('ORIGIN is required to build the extension')
}

const webpackConfig = {
  entry: [
    path.resolve(__dirname, 'src', 'app', 'popup', 'popup.jsx')
  ],
  output: {
    filename: 'popup.js',
    path: buildDir,
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
  },
  plugins: [
    new DefinePlugin({
      'process.env.ORIGIN': JSON.stringify(origin),
    }),
  ],
}

if (process.env.NODE_ENV === 'production') {
  webpackConfig.mode = 'production'
} else {
  webpackConfig.mode = 'development'
  webpackConfig.devtool = 'eval-cheap-module-source-map'
}

module.exports = webpackConfig
