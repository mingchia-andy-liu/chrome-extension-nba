const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpackDevConfig = {
    devtool: 'cheap-module-eval-source-map',
    // https://webpack.js.org/concepts/mode/
    mode: 'development'
}
const webpackProdConfig = {
    // https://webpack.js.org/concepts/mode/
    mode: 'production'
}

const path = require('path')

let webpackConfig = {
    entry: [
        path.resolve(__dirname, 'src', 'app', 'app.jsx')
    ],
    output: {
        // filename: path.join('sidebar', 'app.js'),
        filename: '[name].js',
        path: path.resolve(__dirname, 'src'),
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
                    'css-loader',
                    // compiles Sass to CSS
                    'sass-loader'
                ],
            }
        ],
    },
}

if (process.env.NODE_ENV === 'production') {
    webpackConfig = merge(webpackConfig, webpackProdConfig)
} else {
    webpackConfig = merge(webpackConfig, webpackDevConfig)
}

module.exports = webpackConfig
