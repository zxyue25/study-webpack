const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path');
const WebpackBaseConfig = require('./webpack.base.config')

module.exports = merge(WebpackBaseConfig, {
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'js/index.[name].[chunkhash].js',
        chunkFilename: 'js/[name].chunk.[chunkhash].js'
    },
    mode: 'production',
    plugins: [
        new MiniCssExtractPlugin({
            // 文件名称（指定名称+目录）
            filename: 'css/index.[contenthash:8].css',
            // 非入口chunk名称重命名，不定义的话会走filename，都叫main，webpack会用id命名 0.css 1.css 2.css ...
            chunkFilename: 'css/[name].[contenthash:8].chunk.css'
        }),

        new OptimizeCssAssetsWebpackPlugin({
            filename: 'css/[contenthash].js'
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            miniSize: 30 * 1024,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequest: 5,
            maxInitialRequest: 3,
        }
    },
})

