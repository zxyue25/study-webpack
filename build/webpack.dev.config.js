const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const WebpackBaseConfig = require('./webpack.base.config')

module.exports = {
    mode: 'development',
    entry: '',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: `js/[name].js`,
        chunkFilename: 'js/[name].chunk.js'
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        watchContentBase: true,
        watchOptions: {},
        compress: true,
        overlay: false,
        host: '',
        post: '',
        open: true,
        hot: true, ////热模块替换
        proxy: {

        }
    },
    module: {
        rules: [
            {
                test: /\.(js|vue|tsx)$/,
                included: path.resolve(__dirname, 'src'),
                excluded: /node_modules/,
                enforce: 'pre', // 正常来讲，一个文件只能被一个loader处理，那么一定要指定loader执行的先后顺序
                // 先执行eslint，在执行babel
                use: {
                    loader: 'eslint-loader',
                    options: {
                        configFile: '.eslintrc.js',
                        emitError: false, // 验证失败是否终止
                        fix: true // 是否自动修复
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '.../public/index.html')
        }),
    ]
};
