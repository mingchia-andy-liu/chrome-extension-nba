const path = require('path')

const webpackConfig = {
  entry: [
    path.resolve(__dirname, 'src', 'app', 'app.jsx')
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.js', '.jsx', ".ts", ".tsx"],
  },
  module: {
    rules: [
      // All files with a '.t|js' or '.t|jsx' extension will be handled by 'ts-loader'.
      { test: /\.(t|j)sx?$/, loader: "ts-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // { test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.(s?css)$/,
        use: [
          // creates style nodes from JS strings
          'style-loader',
          // translates CSS into CommonJS
          'css-loader'
        ],
      },
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
