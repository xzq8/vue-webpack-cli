# vue-webpack-cli
webpack4构建的vue的基础项目架构，主要是熟悉webpack4搭建自己的开发环境

## 开始配置功能
1. 新建一个 build 文件夹，新建一个webpack.config.js,用来存放 webpack配置相关的文件
2. 配置 ES6/7/8 转 ES5代码
```
 npm install babel-loader @babel/core @babel/preset-env 
```
3. 在项目根目录添加一个 babel.config.js 文件

4. 通过 babel-polyfill 对一些不支持新语法的客户端提供新语法的实现
5. 按需引入polyfill
```
  npm install core-js@2 @babel/runtime-corejs2 -S
```
配置了按需引入 polyfill 后，用到es6以上的函数，babel会自动导入相关的polyfill，这样能大大减少 打包编译后的体积

6. 配置 scss 转 css
```
npm install sass-loader dart-sass css-loader style-loader -D
``` 
sass-loader, dart-sass主要是将 scss/sass 语法转为css

css-loader主要是解析 css 文件

style-loader 主要是将 css 解析到 html页面 的 style 上

7. 配置 postcss 实现自动添加css3前缀
```
  npm install postcss-loader autoprefixer -D
```
在项目根目录下新建一个 postcss.config.js

8. 使用 html-webpack-plugin来创建html页面，并自动引入打包生成的js文件
```
  npm install html-webpack-plugin -D
```

9. 新建一个 public/index.html 页面

10. 配置 devServer 热更新功能
```
  npm install webpack-dev-server -D
```

11. 配置 webpack 打包 图片、媒体、字体等文件
```
  npm install file-loader url-loader -D
```
file-loader 解析文件url，并将文件复制到输出的目录中

url-loader 功能与 file-loader 类似，如果文件小于限制的大小。则会返回 base64 编码，否则使用 file-loader 将文件复制到输出的目录中

12. 让 webpack 识别 .vue 文件
```
npm install vue-loader vue-template-compiler cache-loader thread-loader -D
npm install vue -S
```
vue-loader 用于解析.vue文件

vue-template-compiler 用于编译模板

cache-loader 用于缓存loader编译的结果

thread-loader 使用 worker 池来运行loader，每个 worker 都是一个 node.js 进程。

13.  定义环境变量
通过 webpack提供的DefinePlugin插件，可以很方便的定义环境变量
```
plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        VUE_APP_BASE_URL: JSON.stringify('http://localhost:3000')
      }
    }),
]
```

14. 区分生产环境和开发环境
webpack.dev.js 开发环境使用

webpack.prod.js 生产环境使用

webpack.config.js 公用配置

- 开发环境
不需要压缩代码
需要热更新
css不需要提取到css文件
sourceMap
…

- 生产环境
压缩代码
不需要热更新
提取css，压缩css文件
sourceMap
构建前清除上一次构建的内容
…

```
npm i @intervolga/optimize-cssnano-plugin mini-css-extract-plugin clean-webpack-plugin webpack-merge copy-webpack-plugin -D
```

@intervolga/optimize-cssnano-plugin 用于压缩css代码
mini-css-extract-plugin 用于提取css到文件中
clean-webpack-plugin 用于删除上次构建的文件
webpack-merge 合并 webpack配置
copy-webpack-plugin 用户拷贝静态资源

15.  修改package.json
```
"scripts": {
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js"
}
```

16. 打包分析
有的时候，我们需要看一下webpack打包完成后，到底打包了什么东西，
这时候就需要用到这个模块分析工具了 webpack-bundle-analyzer
```
npm install --save-dev webpack-bundle-analyzer
```
修改webpack.prod.js
```

```

17. 集成 VueRouter,Vuex
```
npm install vue-router vuex --save
```
在 src 目录下新增一个 router/index.js 文件

运行 npm run dev 命令，如没配置错误，是可以看到点击不同的路由，会切换到不同的路由视图

18. 配置路由懒加载
在没配置路由懒加载的情况下，我们的路由组件在打包的时候，都会打包到同一个js文件去，当我们的视图组件越来越多的时候，就会导致这个 js 文件越来越大。然后就会导致请求这个文件的时间变长，最终影响用户体验
- 安装 @babel/plugin-syntax-dynamic-import
```
npm install @babel/plugin-syntax-dynamic-import --save-dev
```
- 修改babel.config.js
```
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage"
      }
    ]
  ],
  plugins: [
     // 添加这个
    '@babel/plugin-syntax-dynamic-import'
  ]
}
````

- 修改 router/index.js 路由配置文件
```
import Vue from 'vue'
import VueRouter from "vue-router";
Vue.use(VueRouter)
export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/Home',
      component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
      // component: Home
    },
    {
      path: '/About',
      component: () => import(/* webpackChunkName: "About" */ '../views/About.vue')
      // component: About
    },
    {
      path: '*',
      redirect: '/Home'
    }
  ]
})
```
运行命令 npm run build
查看是否生成了 Home...js 文件 和 About...js 文件

19. 集成 Vuex
在 src 目录下新建一个 store/index.js 文件
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  counter: 0
}
const actions = {
  add: ({commit}) => {
    return commit('add')
  }
}
const mutations = {
  add: (state) => {
    state.counter++
  }
}
const getters = {
  getCounter (state) {
    return state.counter
  }
}
export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})


参考文章 :（https://www.ccode.live/lentoo/list/33）
关于@babel/polyfill -- 按需加载 (https://segmentfault.com/a/1190000018632153)
