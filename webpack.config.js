const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotEnv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/frontend/index.js',
    output:{
        path: path.resolve(__dirname, 'src/dist'),
        filename:'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias:{
            '@components': path.resolve(__dirname, 'src/frontend/components'),
            '@styles': path.resolve(__dirname,'src/frontend/styles')
        }
    },
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test:/\.html$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: '[name].[hash:7].[ext]'
                }
             }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/frontend/public/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new CleanWebpackPlugin()
    ],
    optimization:{
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    }
}
