const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')    // for webpack dev server
const path = require('path')

const webpackDevConfig = {
    devtool: 'cheap-module-eval-source-map',
    // https://webpack.js.org/concepts/mode/
    mode: 'development',
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         filename: path.resolve(__dirname, 'src', 'index.html'),
    //         template: path.resolve(__dirname, 'src', 'index.html')
    //       }),
    // ]
}
const webpackProdConfig = {
    // https://webpack.js.org/concepts/mode/
    mode: 'production',
}


let webpackConfig = {
    entry: [
        path.resolve(__dirname, 'src', 'app', 'app.jsx')
    ],
    output: {
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
    devServer: {
        host: 'localhost',
        contentBase: path.resolve(__dirname, 'src'),
    },
}

if (process.env.NODE_ENV === 'production') {
    webpackConfig = merge(webpackConfig, webpackProdConfig)
} else {
    webpackConfig = merge(webpackConfig, webpackDevConfig)
}

module.exports = webpackConfig
