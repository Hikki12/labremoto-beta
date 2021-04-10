// import path from 'path'
// import webpack from 'webpack'
// import HtmlWebPackPlugin from 'html-webpack-plugin';
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
// const __dirname = path.resolve(path.dirname(''));
// console.log("Holaaa", __dirname)

module.exports = {
    context: __dirname,
    entry: './src/frontend/index.js',
    output: {
       path: path.resolve( __dirname, './src/backend/dist' ),
       filename: 'bundle.js',
       publicPath: '/',
    },
    devServer: {
       historyApiFallback: true
    },
    module: {
       rules: [
          {
             test: /\.js$/,
             use: 'babel-loader',
          },
          {
             test: /\.css$/,
             use: ['style-loader', 'css-loader'],
          },
          {
             test: /\.(png|j?g|svg|gif)?$/,
             use: 'file-loader'
          }
 ]
    },
    plugins: [
       new HtmlWebPackPlugin({
          template: path.resolve( __dirname, 'src/frontend/public/index.html' ),
          filename: 'index.html'
       })
    ]
 };

// export default config;