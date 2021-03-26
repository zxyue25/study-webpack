/*
main.js：webpack入口起点文件

    1. 运行指令：webpack以 ./src/main.js 为入口文件打包，打包输出到 ./dist/main.js
    开发环境：webpack ./src/main.js -o ./dist --mode=development
    生产环境：webpack ./src/main.js -o ./dist //默认是生产环境
    或者 webpack ./src/main.js -o ./dist --mode=production

    2. 开发环境打包结果&&生产环境打包结果

    3. 执行命令：node ./dist/main.js 得到结果12

    4. 引入json文件，执行1、3，打包、执行成功，证明webpack可以识别json文件

    5. 引入css、img资源，执行1，打包失败

    结论：
    webpack能处理js、json文件；不能处理css、img文件；
    生产环境和开发环境将es6模块化编译成浏览器可以识别的模块化
    生产环境比开发环境多了一个js压缩

*/
import './index.css';
import './index.less'; // 如果样式资源文件是空的，webpack配置没有处理less资源，在终端执行webpack打包，不会报错
// 引入iconfont样式文件

import './font/iconfont.css'; // import '@babel/polyfill';

// import './print.js'

const add = function add(x, y) {
  return x + y;
};

const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('定时器执行完了～');
    resolve();
  }, 1000);
});
console.log(promise);
console.log(add(3, 9));

// if(module.hot){
//     // 一旦module.hot为true，说明开启了hotHMR功能 --> 让HMR功能代码生效
//     module.hot.accept('./print.js', function(){
//         // 方法会监听print.js文件，一旦发生变化，其他模块不会重新打包构建
//         // 会执行后面的回调函数
//         print()
//     })
// }
