const webpack = require('webpack')
const path = require('path')

const webpackConfig = {
    entry: [
        path.resolve(__dirname, 'src', 'app', 'app.jsx')
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'src', 'build'),
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
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
}

if (process.env.NODE_ENV === 'production') {
    webpackConfig.mode = 'production'
} else {
    webpackConfig.mode = 'development'
    webpackConfig.devtool = 'cheap-module-eval-source-map'
}

module.exports = webpackConfig
