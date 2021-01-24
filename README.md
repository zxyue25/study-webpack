### **webpack的五个核心概念**

1. entry：指示webpack以哪个文件作为入口起点开始打包，**分析构建内部依赖图**

2. output：指示webpack打包后的资源bundles输出到哪里去，以及如何命名

3. loader：让webpack能去处理那些非js文件（如css、html、img等），webpack自身只能理解js（js、json）

4. plugins：插件可以用于执行范围更广的任务，插件的范围包括，从打包到优化和压缩，一直到重新定义环境中的变量等

5. mode：指示webpack使用相应模式模式的配置，webpack内置的两种模式如下：

| 选项 | 描述 | 特点 |
| -- | -- | -- |
| development | 会将process.env.NODE_ENV的值设为development。启用 | 能让代码本地调试、运行的环境|
| production | 会将process.env.NODE_ENV的值设置为production | 能让代码优化、上线运行的环境 |

### **安装**
```
npm install webpack webpack-cli -g
npm install webpack webpack-cli -D //开发时依赖
```
### **初体验**

### **打包样式资源**
./src/main.js
```javascript
import from './index.css';  //新建样式资源并引入
import './index.less'; //如果样式资源文件是空的，webpack配置没有处理less资源，在终端执行webpack打包，不会报错
```
新建webpack.config.js
```javascript
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
                test: /\.css/,
                use: [//使用哪些loader，执行顺序是从下至上；或者说从右到左，依次执行
                    // 创建style标签，将js中的样式资源插入到标签中，添加到head中生效
                    'style-loader',
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    'css-loader'
                    // npm i style-loader css-loader -D
                ],
            },
            {
                test: /\.less/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 将less资源编译成css 
                    //npm i less less-loader -D
                    'less-loader'
                ]
            }
        ],
    },
    plugins: [],
}
}
```
在终端执行webpack，可以看到打包到的./dist/main.js中引入了index.css和index.less


在./dist下新建index.html，因为目前还未处理html资源；引入打包后的main.js
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body>
  <script src="main.js"></script></body>
</html>
```
在浏览器打开，可以看到样式效果生效，并且插入的css、less经过loader处理为style标签插入
![alt 属性文本](https://raw.githubusercontent.com/zxyue25/my-img/master/study-webpack/css-loader.jpg)

### **打包html资源**
npm i html-webpack-plugin -D

webpack.config.js
``` javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.export = {
    ...
    plugins: [
        //// 功能：默认会创建一个空的html文件，自动引入打包输出的所有资源（js/css）new HtmlWebpackPlugin()
        new HtmlWebpackPluign({
             // 复制'./src/index.html'文件，并自动引入打包输出的所有资源（js/css）
            template: './src/index.html'
        })
    ]
}
```

单独配置new HtmlWebpackPlugin()和new HtmlWebpackPluign({template: './src/index.html' })分别在终端执行webpack，可以看到输出的./dist/index.html文件不一样

### **打包图片资源**
index.html
```html
 <div class="code"></div>
 <div class="vue"></div>
```
index.less
```css
.code{
    background: url(./code.jpg) //42kb
}
.vue{
    background: url(./vue.jpg) //6kb
}
```
这时候在终端执行webpack会报错
```javascript
ERROR in ./src/code.jpg 1:0 ...
```
webpack.config.js

npm i url-loader file-loader -D
``` javascript
module.export = {
    ...
    module: {
        rules: [
             ...
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
            }
            ...
        ]
    }
}
```
再次执行webpack，可以打包后结果是一张图片，是code.jpg；vue.jpg被转成了base64

![alt 属性文本](https://raw.githubusercontent.com/zxyue25/my-img/master/study-webpack/img-loader.jpg)

#### 处理html中的img
index.html
```html
<img src='./vue.jpg' />
```
直接执行webpack命令，打包结果如下
```html
<img src='./vue.jpg' />
```
打包后代码不变，打包结果没有vue.jpg，无法正常显示；默认处理不了html中的img图片，因为根本解析不到

npm i html-loader -D 加入html-loader处理
``` javascript
module.export = {
    ...
    module: {
        rules: [
             ...
            {
                //处理html中图片资源 npm i html-loader -D
                test: /\.html$/,
                //处理html中的img，负责引入img，从而能被url-loader处理
                loader: 'html-loader',
            }
            ...
        ]
    }
}
```
webpack打包资源出现
Automatic publicPath is not supported in this browser

解决方法：
在webpack.config.js文件中添加
module.exports = { output: { publicPath: './' } }

或者
webpack打包html里面img后src为“[object Module]”问题，esModule默认为true，手动设置为false；可参考 https://www.jb51.net/article/176947.htm

再次执行webpack命令，打包结果如下
dist/index.html
```html
<img src="be82e5eef968f52d80753ec93eafa448.jpg" />
```
index.html和index.less都引入了vue.jpg但是最后只打包成一张图片



