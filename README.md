### webpack的五个核心概念

1. entry：指示webpack以哪个文件作为入口起点开始打包，**分析构建内部依赖图**

2. output：指示webpack打包后的资源bundles输出到哪里去，以及如何命名

3. loader：让webpack能去处理那些非js文件（如css、html、img等），webpack自身只能理解js（js、json）

4. plugins：插件可以用于执行范围更广的任务，插件的范围包括，从打包到优化和压缩，一直到重新定义环境中的变量等

5. mode：指示webpack使用相应模式模式的配置，webpack内置的两种模式如下：

| 选项 | 描述 | 特点 |
| -- | -- | -- |
| development | 会将process.env.NODE_ENV的值设为development。启用 | 能让代码本地调试、运行的环境|
| production | 会将process.env.NODE_ENV的值设置为production | 能让代码优化、上线运行的环境 |

### 安装
```
npm install webpack webpack-cli -g
npm install webpack webpack-cli -D //开发时依赖
```
### 初体验




