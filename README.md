### **webpack 的五个核心概念**

1. entry：指示 webpack 以哪个文件作为入口起点开始打包，**分析构建内部依赖图**

2. output：指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名

3. loader：让 webpack 能去处理那些非 js 文件（如 css、html、img 等），webpack 自身只能理解 js（js、json）

4. plugins：插件可以用于执行范围更广的任务，插件的范围包括，从打包到优化和压缩，一直到重新定义环境中的变量等

5. mode：指示 webpack 使用相应模式模式的配置，webpack 内置的两种模式如下：

| 选项        | 描述                                                 | 特点                         |
| ----------- | ---------------------------------------------------- | ---------------------------- |
| development | 会将 process.env.NODE_ENV 的值设为 development。启用 | 能让代码本地调试、运行的环境 |
| production  | 会将 process.env.NODE_ENV 的值设置为 production      | 能让代码优化、上线运行的环境 |

### **安装**

```
npm install webpack webpack-cli -g
npm install webpack webpack-cli -D //开发时依赖
```

### **初体验**

### **打包样式资源**

./src/main.js

```javascript
import './index.css';  //新建样式资源并引入
import './index.less'; //如果样式资源文件是空的，webpack配置没有处理less资源，在终端执行webpack打包，不会报错
```

新建 webpack.config.js

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
                    // npm i style-loader css-loader -D
                    // 创建style标签，将js中的样式资源插入到标签中，添加到head中生效
                    'style-loader',
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    'css-loader'
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

在终端执行 webpack，可以看到打包到的./dist/main.js 中引入了 index.css 和 index.less
在./dist 下新建 index.html，因为目前还未处理 html 资源；引入打包后的 main.js

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Webpack App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

在浏览器打开，可以看到样式效果生效，并且插入的 css、less 经过 loader 处理为 style 标签插入
![alt 属性文本](https://raw.githubusercontent.com/zxyue25/my-img/master/study-webpack/css-loader.jpg)

### **打包 html 资源**

npm i html-webpack-plugin -D

webpack.config.js

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.export = {
    ...
    plugins: [
        // 功能：默认会创建一个空的html文件，自动引入打包输出的所有资源（js/css）new HtmlWebpackPlugin()
        new HtmlWebpackPluign({
             // 复制'./src/index.html'文件，并自动引入打包输出的所有资源（js/css）
            template: './src/index.html'
        })
    ]
}
```

单独配置 new HtmlWebpackPlugin()和 new HtmlWebpackPluign({template: './src/index.html' })分别在终端执行 webpack，可以看到输出的./dist/index.html 文件不一样

### **打包图片资源**

#### 处理 css 中的 img

index.html

```html
<div class="code"></div>
<div class="vue"></div>
```

index.less

```css
.code {
  background: url(./code.jpg) //42kb
;
}
.vue {
  background: url(./vue.jpg) //6kb
;
}
```

这时候在终端执行 webpack 会报错

```javascript
ERROR in ./src/code.jpg 1:0 ...
```

webpack.config.js

npm i url-loader file-loader -D

```javascript
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

再次执行 webpack，可以打包后结果是一张图片，是 code.jpg；vue.jpg 被转成了 base64

![alt 属性文本](https://raw.githubusercontent.com/zxyue25/my-img/master/study-webpack/img-loader.jpg)

#### 处理 html 中的 img

index.html

```html
<img src="./vue.jpg" />
```

直接执行 webpack 命令，打包结果如下

```html
<img src="./vue.jpg" />
```

打包后代码不变，打包结果没有 vue.jpg，无法正常显示；默认处理不了 html 中的 img 图片，因为根本解析不到
npm i html-loader -D 加入 html-loader 处理
webpack.config.js

```javascript
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

webpack 打包资源出现
Automatic publicPath is not supported in this browser

解决方法：
在 webpack.config.js 文件中添加
module.exports = { output: { publicPath: './' } }

或者
webpack 打包 html 里面 img 后 src 为“[object Module]”问题，esModule 默认为 true，手动设置为 false；可参考 https://www.jb51.net/article/176947.htm

再次执行 webpack 命令，打包结果如下
dist/index.html

```html
<img src="be82e5eef968f52d80753ec93eafa448.jpg" />
```

index.html 和 index.less 都引入了 vue.jpg 但是最后只打包成一张图片

### **打包其他资源（字体文件）**

在 iconfont 下载字体文件在/src/font 目录下

main.js

```javascript
// 引入iconfont样式文件
import "./font/iconfont.css";
```

index.html

```html
<span class="iconfont icon-dollar"></span>
```

webpack.config.js

```javascript
 // 打包其他资源（除html、css、js之外的资源）比如字体文件
{
    // 排除html、css、js资源）
    exclude: /\.(css|js|html)$/,
    loader: 'file-loader',
    options: {
        name: '[hash:10].[ext]'
    }
}
```

执行 webpack 命令，在 dist 目录下可以看到打包的字体文件，打开 dist/index.html 可以看到引入的图标生效

### **配置 devServer**

```javascript
    // 开发服务器：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）
    // 特点：没有输出，只会在内存中编译打包，不会有任何输出
    // npx 想要解决的主要问题，就是调用项目内部安装的模块 http://www.ruanyifeng.com/blog/2019/02/npx.html
    // 启动devserver的命令为：npx webpack-dev-server(webpack4)
    // 启动devserver的命令为：npx webpack serve(webpack5)
    // 原理：https://segmentfault.com/a/1190000006964335?utm_source=tag-newest
    // npm i webpack-dev-server -D
    devServer: {
        contentBase: resolve(__dirname, 'dist'),// 项目构建后路径
        compress: true,// 启动gzip压缩
        port: 3000,// 端口号
        open: true// 自动打开浏览器
    },
```

### **构建环境介绍**

以上是开发环境的配置，mode: 'development'

生产环境还需考虑的问题：
1. css 文件从 js 文件中提取出来：开发环境打包结果，字体文件和图片打包出独立的文件，目录由 options.outputName 决定，而 css、less 样式文件经过 css-loader 处理，变成 common.js 模块加载到 js 中，这样会造成 js 文件特别大，加载慢，且样式最终需要经过 style-loader 处理插到 html 中，会导致页面出现闪屏的问题
2. 代码统一进行压缩
3. 兼容性问题：样式、部分 js，比如某些样式需要加前缀才能在低版本浏览器正常使用

### **提取 css 成单独文件**

npm i mini-css-extract-plugin -D
webpack.config.js

```javascript
...
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module: {
    rules:[
          {
            test: /\.css/,
            use: [//使用哪些loader，执行顺序是从下至上；或者说从右到左，依次执行
                // npm i style-loader css-loader -D
                // 创建style标签，将js中的样式资源插入到标签中，添加到head中生效
                // 'style-loader',
                // 取代style-loader，提取js中的css成单独文件
                MiniCssExtractPlugin.loader,
                // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                'css-loader'
            ],
        },
    ]
},
plugins: [
    // new MiniCssExtractPlugin()
    new MiniCssExtractPlugin({
        filename: 'css/index.css' //指定提取css文件的在dist下的目录
    })
]
```

执行 webpack，可以看到打包生成 dist/css/index.css，dist/index.html 中引入 css 文件

```html
<link href="/main.css" rel="stylesheet" />
```

在浏览器打开 index.html，可以看到如下
![alt 属性文本](https://raw.githubusercontent.com/zxyue25/my-img/master/study-webpack/img-loader.jpg)
样式通过 link 标签引入，不会有闪的问题

### 11 css 兼容性处理(postcss)
npm i postcss-loader postcss-preset-env -D
webpack.config.js
```js
// 设置node环境变量
process.env.NODE_ENV = "development";
module: {
    rules:[
          {
            test: /\.css/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                /*
                css 兼容性处理：postcss --> postcss-loader plugin:postcss-preset-env
                */
                //npm i postcss-loader postcss-preset-env -D
                // 使用
                {
                  loader: "postcss-loader",
                  options: {
                    postcssOptions: {
                      //postcss的插件
                      //帮postcss找到package.json中browserlist里面的配置，可识别环境，通过配置加载指定的css兼容性样式
                      plugins: [
                          [
                              "postcss-preset-env"
                          ]
                      ],
                      /*
                          "browserslist": {
                              // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = "development"
                              "development": [
                                  "last 1 chrome version", //兼容chrome最近一个版本
                                  "last 1 firefox version",
                                  "last 1 safari version"
                              ],
                              // 生产环境：默认看生产环境 跟webpack.config.js mode无关
                              "production":[
                                  ">0.2%", //兼容99.8%的浏览器
                                  "not dead", //兼容没有dead的浏览器
                                  "not op_mini all"
                              ]
                          }
                      */
                    },
                  },
                },
              ],
          },
    ]
}
```
package.json
```json
 "browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production":[
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  }
```
index.css
```css
body{
    ...
    display: flex;
    backface-visibility: hidden;
}
```
执行 webpack，可以看到打包生成 dist/css/index.css
```css
body{
    ...
    display: flex;
    -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
}
```
注释package.json中process.env.NODE_ENV = "development";
执行 webpack，可以看到打包生成 dist/css/index.css
```css
body{
    ...
    display: -webkit-flex;
    display: flex;
    -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
}
```

### 12 压缩css(optimize-css-assets-webpack-plugin)
npm i optimize-css-assets-webpack-plugin -D
webpack.config.js
```js
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
...
plugins: [
    ...
    // 压缩css
    // npm i optimize-css-assets-webpack-plugin -D
    new OptimizeCssAssetsWebpackPlugin(),
]
```
执行 webpack，可以看到打包生成 dist/css/index.css已经被压缩，对比压缩前后css文件大小，从2.58kb变成2.34kb
``` css
body{height:100%;width:100%;background-color:red;display:flex;-webkit-backface-visibility:hidden;backface-visibility:hidden}@font-face{font-family:iconfont;src:url(/font/67b199ed6b.eot);src:url(/font/67b199ed6b.eot#iefix) format("embedded-opentype"),url("data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAASoAAsAAAAACXQAAARcAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDQAqFYIRbATYCJAMYCw4ABCAFhG0HZhsXCBEVpDmQfZFg207YPiRFXdMUDu9LHUnXRBC/9pt99+6+GN7EEvxIxxsekjZLEC00qIRMJpOKNS+Bn77TXqDZoDA0bU/Y9Cx9XVKZ9ntr0475da0wUXVMie3y0zPyz7PC5QO0jA1g0v7PMdOlRYHkt9lcMoLWtDfA8YAGFpG23YHcgRXIifoNY5cXeZ5A0wQjlHWfoChgy/RpgTjLz00HdsIgV5BDXV0VrM0QD8BQT/3USwDuvd+PP7AINkjKAvS5uzneWeD2JvvNP1qbqA2SHAQIh7OBbaJAH8jEZaHjAmhBoo+mKR9OtwqgqS5Jnzlv8t78evNPJAIYVhJJNuRoahv/8ihkpZCICnRFG2E3kyWf2Rabgs8cNpnPPEG18hfUCaj8B+skUA04pokPgBgDHdfnCAl92LykypSUEJeX4nJrgXjWJ42l/WROoIFD0KY/ba+9X5uUPtx2y0sKUMjccTlgIRMrvUyfHLxJaTeYOaAjc8fgCKV969aDurKUwtu3o2/dikJ3YgAFAbiJKHH3buwdys/hBlwsA3TY8YBMzkz70qB0du7sINkmlTU1VTnDSGs3Ym6svzlynWzubKZwZ3sjf+0hOTo+rE3AHZ6WHZSN5W04qsiYP5I0JcU1H4uitAsRmpFhzBKCQeksNLCxjZQmZpfahbHcqYhM8AafoHbVkzEzUeZu9VUSLGfvKCuqf17ln7Zs25PaCt/oK2Y+Nl7W85C5qirdmyf5P2smtlNPq/rA+4HXboo2mhZy7Gv3zph5gOhp2unTtGmD63Dte2h9KDLM1+3ibrdkr6hOxKphLFtFraXWr15dD6RUyIVyt1oHFyy4rVzp9gxE8eaio/rlNeWxq7OzK/b36Y+O0l4Lqpc8HGWFxyXl+xyVjVi/rOZ4f1LrpmXLyBzUHBXLWn4ORbDe/y38hvnQe/w2W41Wvg7jkb0Dkd+wALqPUn6csbRjOD7Zn6fB2z/GgUZTiDip0rf54ori124fU1dUn5iuvhYj86t5TmgC/aT0RL0GQHFAfQZAcUUN0iadUi8B/KOtpP75h/7G9fHrEqkCp99sgg7wavX1puf7R4dmCvgRlBoL/xhhw7asiHVjlaXWVoVAZSP2FQlNTfwpniFPhlKNNi4l1I1GkNSMQ6FuDpmxfSi1LEKlbgmaFvhubhlWATSROcC8bgBhwFZIul6gMOAyMmMfQ2nMZ6gM0GIJyjdOex6cw6oLYypYQPYHm1OnTbMov/yJZmhSjos92hfZ2TBEfphOP7BDHmKBG00sokEztXAHl2HTEPRMFebilyJ9EgS66J38nNqZcsFQSqACyPwBK0c62ukuVObnn5AxaKS4oqXM+YWYY/sHEV/YAPlQdI1aLmWwMzJiQmg8SWOkBe7QhhojQUBfPKqCcsJXdoj1EgHqpJsq/OlV7V3uAQDRD2BGaWOdz+aEmtOZuy2tE+K/Splp8grL3B3DQUPWoMfWlLI95LwWO5nNAA==") format("woff2"),url(/font/2bb59db229.woff) format("woff"),url(/font/a04a06a7d9.ttf) format("truetype"),url(/font/086b7e8295.svg#iconfont) format("svg")}.iconfont{font-family:iconfont!important;font-size:16px;font-style:normal;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.icon-dollar:before{content:"\e6f4"}.icon-history:before{content:"\e6f8"}.icon-arrow-down:before{content:"\e665"}.icon-arrow-double-right:before{content:"\e666"}.icon-comment:before{content:"\e668"}
```

### 13 js语法检查(eslint、airbnb)
统一团队代码风格，保证代码可读性
npm i eslint eslint-loader eslint-config-airbnb-base eslint-plugin-import -D
webpack.config.js
```js
rules: [        
    ...
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
            Our default export contains all of our ESLint rules, including ECMAScript 6+. It requires eslint and eslint-plugin-import.
        */
        //  npm i eslint eslint-loader eslint-config-airbnb-base eslint-plugin-import -D
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: /node_modules/,
        options: {
            // 自动修复
            // fix: true
        }
    }
 ]
 ```
package.json新增字段
```json
"eslintConfig": {
  "extends": "airbnb-base"
}
```
或者根目录新建.eslintrc
```json
{
  "extends": "airbnb-base"
}
```
执行 webpack，可以看到控制台报错
```js
/Users/zhengxiuyue/Documents/github-workspace/study-webpack/src/main.js
  30:15  error    A space is required after ','  comma-spacing
  34:1   warning  Unexpected console statement   no-console
✖ 2 problems (1 error, 1 warning)
  1 error and 0 warnings potentially fixable with the `--fix` option.
  ```
webpack.config.js配置自动修复
```json
 options: {
   // 自动修复
   fix: true
 }
 ```
在次执行，js文件中已修复不符合代码，无报错，如下图
```js
/Users/zhengxiuyue/Documents/github-workspace/study-webpack/src/main.js
  34:1  warning  Unexpected console statement  no-console
✖ 1 problem (0 errors, 1 warning)
```
如果想要无warning，可以在main.js加入eslint-disable-next-line