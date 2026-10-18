const path = require('path')
const fs = require('fs')
const { RawSource } = require('webpack').sources
const { DefinePlugin } = require('webpack')

const buildDir = process.env.BUILD_DIR || path.resolve(__dirname, 'build')
const manifestName = process.env.BUILD_MANIFEST || 'manifest.json'
const proxyOrigin = process.env.PROXY_ORIGIN

if (!proxyOrigin) {
  throw new Error('PROXY_ORIGIN is required to build the extension')
}

const manifestPlugin = {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('ManifestPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ManifestPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          const manifest = fs.readFileSync(
            path.resolve(__dirname, 'build', manifestName),
            'utf8'
          )
          compilation.emitAsset('manifest.json', new RawSource(manifest))
        }
      )
    })
  },
}

const webpackConfig = {
  entry: [
    path.resolve(__dirname, 'src', 'app', 'app.jsx')
  ],
  output: {
    filename: 'main.js',
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
    manifestPlugin,
    new DefinePlugin({
      'process.env.PROXY_ORIGIN': JSON.stringify(proxyOrigin),
    }),
  ],
}

if (process.env.NODE_ENV === 'production') {
  webpackConfig.mode = 'production'
} else {
  webpackConfig.mode = 'development'
  webpackConfig.devtool = 'cheap-module-source-map'
}

module.exports = webpackConfig
