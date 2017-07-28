//TODO tree-shaking three.js
// https://stackoverflow.com/questions/41538767/how-do-i-tree-shake-three-js-using-webpack-or-rollup/41558527#41558527
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    devtool: 'cheap-source-map', //TODO prod value - source-map
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
            { test: /OrbitControls/, use: ['imports-loader?THREE=three', 'exports-loader?THREE.OrbitControls'] }
        ]
    },
    resolve: {
        alias: {
            'three-examples': path.join(__dirname, './node_modules/three/examples/js')
        }
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
};
