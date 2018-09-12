const webpack = require('webpack')
const path = require('path')

const webpackConfig = {
    entry: [
        path.resolve(__dirname, 'src', 'app', 'background.js')
    ],
    output: {
        filename: 'background.min.js',
        path: path.resolve(__dirname, 'src', 'build'),
    },
    resolve: {
        extensions: ['.js'],
    },
    mode: 'production',
    plugins: [
        // Ignore all locale files of moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
}

module.exports = webpackConfig
