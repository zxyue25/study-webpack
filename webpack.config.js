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

const { resolve } = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  // webpack配置
  entry: "./src/main.js",
  // 开发服务器：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
  // 特点：没有输出，只会在内存中编译打包，不会有任何输出
  // npx 想要解决的主要问题，就是调用项目内部安装的模块 http://www.ruanyifeng.com/blog/2019/02/npx.html
  // 启动devserver的命令为：npx webpack-dev-server(webpack4)
  // 启动devserver的命令为：npx webpack serve(webpack5)
  // 原理：https://segmentfault.com/a/1190000006964335?utm_source=tag-newest
  // npm i webpack-dev-server -D
  devServer: {
    contentBase: resolve(__dirname, "dist"), // 项目构建后路径
    compress: true, // 启动gzip压缩
    port: 3000, // 端口号
    open: true, // 自动打开浏览器
  },
  output: {
    // 文件名
    filename: "main.js",
    // 输出路径
    // __dirname nodejs的变量，代表当前文件的目录的绝对路径
    path: resolve(__dirname, "dist"),
    publicPath: "/",
  },
  // loader的配置
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          //使用哪些loader，执行顺序是从下至上；或者说从右到左，依次执行
          // npm i style-loader css-loader -D
          // 创建style标签，将js中的样式资源插入到标签中，添加到head中生效
          //  "style-loader",
          // 取代style-loader，提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          "css-loader",
        ],
      },
      {
        test: /\.less/,
        use: [
          "style-loader",
          "css-loader",
          // 将less资源编译成css
          //npm i less less-loader -D
          "less-loader",
        ],
      },
      {
        //处理图片资源
        test: /\.(jpg|jpg|gif)$/,
        //只要使用一个loader时，用loader声明，多个时，用use
        loader: "url-loader",
        options: {
          // 图片大小小于8kb，会被base64处理
          // 优点：减少请求数量（减轻服务器压力）
          // 缺点：图片体积会变大，转换成base64字符串格式之后，所以大图片不转换成base64处理，小图片几kb影响不大（文件请求速度更慢）
          limit: 8 * 1024,
          // 给图片进行重命名
          // [hash:10]取图片的hash前10位
          // [ext]取文件原来扩展名
          name: "[hash:10].[ext]",
          outputPath: "imgs", // 构建后路径 /dist/imgs
        },
      },
      {
        //处理html中图片资源 npm i html-loader -D
        test: /\.html$/,
        //处理html中的img，负责引入img，从而能被url-loader处理
        loader: "html-loader",
      },
      // 打包其他资源（除html、css、js之外的资源）比如字体文件
      {
        // 排除tml、css、js资源）
        exclude: /\.(css|js|html|less|jpg)$/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
          outputPath: "font",
        },
      },
    ],
  },
  plugins: [
    //功能：默认会创建一个空的html文件，自动引入打包输出的所有资源（js/css）
    // new HtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
      // 复制'./src/index.html'文件，并自动引入打包输出的所有资源（js/css）
      template: "./src/index.html",
    }),
    // new MiniCssExtractPlugin()
    new MiniCssExtractPlugin({
      filename: "css/index.css", //指定提取css文件的在dist下的目录
    }),
  ],
};
