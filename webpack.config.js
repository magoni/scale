const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules\/(?!(orbit-controls-es6)\/).*/ }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], { exclude: ['scale.mp3'] }),
        new HtmlWebpackPlugin({
            title: 'scale',
            template: 'index-template.ejs'
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    }
}
