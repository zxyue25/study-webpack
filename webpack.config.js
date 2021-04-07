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

// 设置node环境变量
process.env.NODE_ENV = 'production'

const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// const workboxWebpackPlugin = require('workbox-webpack-plugin')
const webpack = require("webpack")
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')

module.exports = {
  mode: 'development',
  // mode="production" //压缩js，生产环境自动压缩js代码，会启用自带的UglifyJsPlugin
  // webpack配置
  // 单入口
  entry: './src/main.js',
  // 多入口，有一个入口，最终输出就有一个bundle
  // entry: {
  //   main: "./src/main.js",
  //   print: "./src/print.js"
  // },
  // 开发服务器：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
  // 特点：没有输出，只会在内存中编译打包，不会有任何输出
  // npx 想要解决的主要问题，就是调用项目内部安装的模块 http://www.ruanyifeng.com/blog/2019/02/npx.html
  // 启动devserver的命令为：npx webpack-dev-server(webpack4)
  // 启动devserver的命令为：npx webpack serve(webpack5)
  // 原理：https://segmentfault.com/a/1190000006964335?utm_source=tag-newest
  // npm i webpack-dev-server -D
  target: 'web', //自动更新
  devtool: 'source-map', //一种提供源代码到构建后代码映射技术，作用：如果构建代码错了，通过映射关系可以追踪到原代码错误
  // 可配置项 [inline-|hidden-|eval-][nosources][cheap-[module-]]source-map
  devServer: {
    contentBase: resolve(__dirname, 'dist'), // 项目构建后路径
    compress: true, // 启动gzip压缩
    port: 3000, // 端口号
    open: true, // 自动打开浏览器
    hot: true, //热模块替换
    // hot module replacement 热模块替换 / 模块热替换
    // 作用：一个模块发生变化，只会重新打包这一个模块，而不是重新打包所有模块，极大的提升构建速度
    // • 样式文件：可以使用HMR功能，因为style-loader内部实现了
    // • js文件：默认没有HMR功能，重新打包所有模块
    // • 注意：HMR功能对js处理，只能处理非入口文件，因为入口文件引入了全部内容，入口文件变化，其他文件变化
    // • html文件：默认没有HMR功能，同时会导致问题：html文件不能热更新（不需要做HMR功能）
    // • 解决：修改entry入口，将html文件引入
  },
  output: {
    // 文件名
    // filename: 'main.js',
    //
    /* 
      • babel缓存：cacheDirectory --> 让第二次打包构建速度更快
       生产环境下，文件变化时读取缓存
      • 文件资源缓存：hash --> 让代码上线运行缓存更好使用
        • hash：每次webpack构建时会生成一个唯一的hash值
          • 问题：因为js和css同时使用一个hash值，如果重新打包就会导致所有的缓存失效（仅改变一个文件）
        • chunkhash：根据chunk生成hash值，如果打包来源于同一个chunk，那么hash值一样
          • 问题：css和js的hash值还是一样
            • 因为css是在js中引入的，所以同属一个chunk
        • contenthash：根据文件的内容生成hash值，不同文件hash值一定不一样，只有改变的文件会重新生成hash值，没变的不会
    */
    filename: 'main.[contenthash:10].js', //文件资源缓存处理 'main.[chunkhash:10].js' || 'main.[hash:10].js'
    // filename: '[name].[contenthash:10].js', //多入口
    // 输出路径
    // __dirname nodejs的变量，代表当前文件的目录的绝对路径
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  // loader的配置
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          // 使用哪些loader，执行顺序是从下至上；或者说从右到左，依次执行
          // npm i style-loader css-loader -D
          // 创建style标签，将js中的样式资源插入到标签中，添加到head中生效
          //  "style-loader",
          // 取代style-loader，提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader',
          /*
          css 兼容性处理：postcss --> postcss-loader plugin:postcss-preset-env
          */
          // npm i postcss-loader postcss-preset-env -D
          // 使用
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // postcss的插件
                // 帮postcss找到package.json中browserlist里面的配置，可识别环境，通过配置加载指定的css兼容性样式
                plugins: [['postcss-preset-env']],
                /*
                    "browserslist": {
                        // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = "development"
                        "development": [
                            "last 1 chrome version",
                            "last 1 firefox version",
                            "last 1 safari version"
                        ],
                        // 生产环境：默认看生产环境 跟webpack.config.js mode无关
                        "production":[
                            ">0.2%",
                            "not dead",
                            "not op_mini all"
                        ]
                    }
                */
              },
            },
          },
        ],
      },
      {
        test: /\.less/,
        use: [
          'style-loader',
          'css-loader',
          // 将less资源编译成css
          // npm i less less-loader -D
          'less-loader',
        ],
      },
      {
        // 处理图片资源
        test: /\.(jpg|jpg|gif)$/,
        // 只要使用一个loader时，用loader声明，多个时，用use
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb，会被base64处理
          // 优点：减少请求数量（减轻服务器压力）
          // 缺点：图片体积会变大，转换成base64字符串格式之后，所以大图片不转换成base64处理，小图片几kb影响不大（文件请求速度更慢）
          limit: 8 * 1024,
          // 给图片进行重命名
          // [hash:10]取图片的hash前10位
          // [ext]取文件原来扩展名
          name: '[hash:10].[ext]',
          outputPath: 'imgs', // 构建后路径 /dist/imgs
          esModule: false, // html中用的是common, url-loader中用的是es6，需要关掉
        },
      },
      {
        // 处理html中图片资源 npm i html-loader -D
        test: /\.html$/,
        // 处理html中的img，负责引入img，从而能被url-loader处理
        loader: 'html-loader',
      },
      // 打包其他资源（除html、css、js之外的资源）比如字体文件
      {
        // 排除html、css、js资源）
        exclude: /\.(css|js|html|less|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'font',
        },
      },
      // {
      //   /*
      //       语法检查：eslint-loader eslint
      //       检查自己写的代码，第三方库不用检查
      //       设置检查规则：
      //       方式一：在package.json中eslintConfig中设置
      //       "eslintConfig": {
      //           "extends": "airbnb-base"
      //       }
      //       方式二：
      //       根目录新建.eslintrc
      //       {
      //           "extends": "airbnb-base"
      //       }
      //       推荐使用规则：airbnb
      //       airbnb在eslint使用：
      //       1. eslint-config-airbnb 包含react风格
      //       2. eslint-config-airbnb-base 用这个
      //       eslint-config-airbnb-base
      //       Our default export contains all of our ESLint rules,
      //       including ECMAScript 6+. It requires eslint and eslint-plugin-import.
      //       // eslint-disable-next-line
      //    */
      //   //  npm i eslint eslint-loader eslint-config-airbnb-base eslint-plugin-import -D
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/,
      //   enforce: 'pre',
      //   options: {
      //     // 自动修复
      //     fix: true,
      //   },
      // },
      {
        /*
            js兼容性处理：babel-loader @babel/core @babel/preset-env
            npm i babel-loader @babel/core -D
            1. 基本js兼容性处理 --> @babel/preset-env
            npm i @babel/preset-env -S
              问题：只能转换基本语法，如promise高级语法不能转换
            2. 全部js兼容性处理 --> @babel/polyfill
              npm i @babel/polyfill -S
              问题：我只要解决部分兼容性问题，但是将所有的兼容性代码全部引入，体积太大了
            3. 高级语法，需要做兼容性处理的就：按需加载 --> core-js
              npm i core-js -S
            结合1、3做兼容性处理
         */
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 或者在.babelrc babel.config.json 中配置
          // 预设，指定babel做这样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 按需加载的内容
                corejs: {
                  version: 3, // 制定版本
                },
                // 指定兼容性做到哪个版本
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17',
                },
              },
            ],
          ],
        },
      },
    ],
  },
  plugins: [
    // 功能：默认会创建一个空的html文件，自动引入打包输出的所有资源（js/css）
    // new HtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 复制'./src/index.html'文件，并自动引入打包输出的所有资源（js/css）
      template: './src/index.html',
      // 压缩html
      // minify: {
      //   // 移除空格
      //   collapseWhitespace: true,
      //   // 移除注释
      //   removeComments: true,
      // },
    }),
    // new MiniCssExtractPlugin()
    new MiniCssExtractPlugin({
      // filename: 'css/index.css', // 指定提取css文件的在dist下的目录
      filename: 'css/index.[contenthash:10].css', // 文件资源缓存处理 'css/index.[hash:10].css' || 'css/index.[hash]:10].css'
    }),
    // 压缩css
    // npm i optimize-css-assets-webpack-plugin -D
    new OptimizeCssAssetsWebpackPlugin(),

    // PWA
    // npm i workbox-webpack-plugin -D
    // new workboxWebpackPlugin.GenerateSW({
    //   /*
    //     1. 帮助serviceworker快速启动
    //     2. 删除旧的serviceworker

    //     生成一个 serviceworker 配置文件，需要通过配置文件注册serviceworker
    //    */
    //   clientsClaim: true,
    //   skipWaiting: true
    // })

    // dll
    // 告诉webpack哪些库不参与打包。同时使用时的名称也得变
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    // npm i add-asset-html-webpack-plugin -D
    // 将某个文件打包输出出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    })
  ],
  // 解析模块规则
  resolve: {
    // 配置解析模块路径别名:简写路径
    alias: {
      $css: resolve(__dirname, 'src/css'),
    },
    // 配置省略文件路径的后缀名
    extensions: ['.js', '.json', '.css'],
    // 告诉webpack解析模块是去找哪个目录，默认去当前路径层级找，找不到找上一层级的
    modules: [resolve(__dirname, '../../node_modules'), 'node_modules'], //先找第一个，再找第二个，防止第一个找不到
  },
}
