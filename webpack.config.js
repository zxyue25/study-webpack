/*
webpack.config.js webpack的配置文件
作用：指示 webpack 干哪些活（当运行webpack时，会加载里面的配置）

所有构建工具都基于node.js平台运行的，模块化默认采用common.js
（配置文件采用common.js src下是es6）
 */

 /*
 loader：1.下载 2.使用（配置loader）
  plugins：1.下载 2.引入 3.使用
webpack.config.js webpack的配置文件
作用：指示 webpack 干哪些活（当运行webpack时，会加载里面的配置）

所有构建工具都基于node.js平台运行的，模块化默认采用common.js
（配置文件采用common.js src下是es6）
 */

const { resolve } = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    // webpack配置
    entry: './src/main.js',
    output: {
        publicPath: '',
        // 文件名
        filename: 'main.js',
        // 输出路径
        // __dirname nodejs的变量，代表当前文件的目录的绝对路径
        path: resolve(__dirname, 'dist')
    },
    // loader的配置
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [//使用哪些loader，执行顺序是从下至上；或者说从右到左，依次执行
                    // 创建style标签，将js中的样式资源插入到标签中，添加到head中生效
                    'style-loader',
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    'css-loader'
                    // npm i style-loader css-loader -D
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 将less资源编译成css 
                    //npm i less less-loader -D
                    'less-loader'
                ]
            },
            {
                //处理图片资源
                test: /\.(jpg|jpg|gif)$/,
                //只要使用一个loader时，用loader声明，多个时，用use
                loader: 'url-loader',
                options: {
                    // 图片大小小于8kb，会被base64处理
                    // 优点：减少请求数量（减轻服务器压力）
                    // 缺点：图片体积会变大，转换成base64字符串格式之后，所以大图片不转换成base64处理，小图片几kb影响不大（文件请求速度更慢）
                    limit: 8 * 1024,
                    // 给图片进行重命名
                    // [hash:10]取图片的hash前10位
                    // [ext]取文件原来扩展名
                    name: '[hash:10].[ext]'
                }
            },
            {
                //处理html中图片资源 npm i html-loader -D
                test: /\.html$/,
                //处理html中的img，负责引入img，从而能被url-loader处理
                loader: 'html-loader',
            }
        ],
    },
    plugins: [
        // html-webpack-plugin
        // 功能：默认会创建一个空的html文件，自动引入打包输出的所有资源（js/css）new HtmlWebpackPlugin()
        // new HtmlWebpackPlugin()
        // 需求：需要有结构的html文件 
        new HtmlWebpackPlugin({
            // 复制'./src/index.html'文件，并自动引入打包输出的所有资源（js/css）
            template: './src/index.html'
        })

    ],
}