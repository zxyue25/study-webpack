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
process.env.NODE_ENV = 'development';

const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'development',
  // webpack配置
  entry: './src/main.js',
  // 开发服务器：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
  // 特点：没有输出，只会在内存中编译打包，不会有任何输出
  // npx 想要解决的主要问题，就是调用项目内部安装的模块 http://www.ruanyifeng.com/blog/2019/02/npx.html
  // 启动devserver的命令为：npx webpack-dev-server(webpack4)
  // 启动devserver的命令为：npx webpack serve(webpack5)
  // 原理：https://segmentfault.com/a/1190000006964335?utm_source=tag-newest
  // npm i webpack-dev-server -D
  devServer: {
    contentBase: resolve(__dirname, 'dist'), // 项目构建后路径
    compress: true, // 启动gzip压缩∏
    port: 3000, // 端口号
    open: true, // 自动打开浏览器
  },
  output: {
    // 文件名
    filename: 'main.js',
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
      {
        /*
            语法检查：eslint-loader eslint
            检查自己写的代码，第三方库不用检查
            设置检查规则：
            方式一：在package.json中eslintConfig中设置
            "eslintConfig": {
                "extends": "airbnb-base"
            }
            方式二：
            根目录新建.eslintrc
            {
                "extends": "airbnb-base"
            }
            推荐使用规则：airbnb
            airbnb在eslint使用：
            1. eslint-config-airbnb 包含react风格
            2. eslint-config-airbnb-base 用这个
            eslint-config-airbnb-base
            Our default export contains all of our ESLint rules,
            including ECMAScript 6+. It requires eslint and eslint-plugin-import.
            // eslint-disable-next-line
         */
        //  npm i eslint eslint-loader eslint-config-airbnb-base eslint-plugin-import -D
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          // 自动修复
          fix: true,
        },
      },
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
        options: { // 或者在.babelrc babel.config.json 中配置
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
    }),
    // new MiniCssExtractPlugin()
    new MiniCssExtractPlugin({
      filename: 'css/index.css', // 指定提取css文件的在dist下的目录
    }),
    // 压缩css
    // npm i optimize-css-assets-webpack-plugin -D
    new OptimizeCssAssetsWebpackPlugin(),
  ],
};
