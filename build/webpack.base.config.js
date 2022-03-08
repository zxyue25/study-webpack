const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happy-pack') // 并行编译
const path = require('path')
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production'

const CssLoader = [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader',
    {
        loader: 'postcss-loader',
        options: {
            plugins: () => require('autoprefixer')
        }
    }
]

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: {
        main: path.resolve(__dirname, 'src/main.js')
    },
    output: {
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=happy-babel-js',
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    ...CssLoader
                ]
            },
            {
                test: /\.less$/,
                use: [
                    ...CssLoader,
                    'less-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif|)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8 * 1024,
                        name: '[hash:10].[ext]',
                        outputPath: 'img'
                    }
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader' // 处理html中的img
            },
            {
                test: '',
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'happy-babel-js',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    presets: [
                        [
                            '@babel/env',
                            {
                                
                            }
                        ]
                    ]
                }
            }]

        }),

        new webpack.DefinePlugin({
           'process.env':{
               isProduction
           }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        },
        extensions: ['.js', '.vue'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    externals: {

    }
}