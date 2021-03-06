
## 技术栈

【前端】

- `Vue`：用于构建用户界面的 MVVM 框架。它的核心是**响应的数据绑定**和**组系统件**
- `vue-router`：为单页面应用提供的路由系统，项目上线前使用了 `Lazy Loading Routes` 技术来实现异步加载优化性能
- `vuex`：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
- `vue-lazyload`：第三方图片懒加载库，优化页面加载速度
- `vux`：基于 WeUI 和 Vue.js 的 移动端 UI 组件库,提供丰富的组件满足移动端(微信)页面常用业务需求
- `better-scroll`：iscroll 的优化版，使移动端滑动体验更加流畅
- `stylus and less`：css 预编译处理器
- `ES6`：ECMAScript 新一代语法，模块化、解构赋值、Promise、Class 等方法非常好用

【后端】

- `Node.js`：利用 Express 起一个本地测试服务器
- `jsonp`：服务端通讯。抓取 QQ音乐数据
- `axios`：服务端通讯。结合 Node.js 代理后端请求，抓取 QQ音乐数据

【自动化构建及其他工具】

- `vue-cli`：Vue 脚手架工具，快速初始化项目代码
- `webpack`：是一款模块加载器兼打包工具,它能把各种资源,例如JS(含JSX)、coffee、样式(含less/sass/stylus)、图片等都作为模块来使用和处理。
- `eslint`：代码风格检查工具，规范代码书写(该项目暂时注释掉)
- `vConsole`：移动端调试工具，在移动端输出日志


## 收获

1. 总结了一套 Vue 通用组件，可以在其它项目中复用的 15+ 个基础组件、25+ 个业务组件
2. 总结了一套常用的 `stylus mixin` 库
3. 总结了一套常用的 `JS` 工具函数库
4. 体会到组件化、模块化开发带来的便捷
5. 体会到将对象封装成类 `ES6 class` 的便捷性，以及利用工厂方式初始化类实例
6. 学会利用 `js` 编写过渡效果及动画效果制作良好的用户交互体验
7. 学会怎么使用方便的组件库进行开发，例如 `vux的tab和swiper`


## TODO

1. 数据全部来自 QQ 音乐，接口改变了可能就要修改 `jsonp` 和 `axios` 代码
2. 我会不断优化页面体验

## 实现细节

主要页面：播放器内核页、(首页)推荐页、歌单详情页、歌手页、歌手详情页、新歌页面、专辑页面、简介页面、排行页、搜索页、添加歌曲页、个人中心页等。

核心页面：播放器内核页,首页,歌手页面,新歌页面

**组件树**

```
<app> ................... 根组件
  <player> .............. 全局的播放器内核组件
  <header> .............. 头部组件
  <router-view> ......... 路由
    <recommend> ......... 推荐页(音乐馆)
    <singer> ............ 歌手页
    <rank> .............. 排行页
    <type> .............. 分类歌单页
    <radio-station> ..... 电台页
    <search> ............ 搜索页
    <user-center> ....... 个人中心页
    <about> ............. 关于页
```

**推荐页（音乐馆）**

上部分是一个轮播图组件，使用第三方库 `better-scroll` 辅助实现，使用 `jsonp` 抓取 QQ音乐(移动端)数据

下部分是一个歌单推荐列表，使用 `axios + Node.js` 代理后端请求，绕过主机限制 (伪造 headers)，抓取 QQ音乐(PC端)数据

歌单推荐列表图片，使用图片懒加载技术 `vue-lazyload`，优化页面加载速度

为了更好的用户体验，当数据未请求到时，显示 `loading` 组件

**歌手页**

左右联动是这个组件的难点

左侧是一个歌手列表，使用 `jsonp` 抓取 QQ音乐(PC端)歌手数据并重组 JSON 数据结构

列表图片使用懒加载技术 `vue-lazyload`，优化页面加载速度

右侧是一个字母列表，与左侧歌手列表联动，滚动固定标题实现

**电台页**

实现和歌手页差不多

**分类歌单页**

上部分为选择的分类名称

下部分为每个分类下的歌单

实现很容易

**播放器内核页**

核心组件。用 `vuex` 管理各种播放时状态，播放、暂停等功能调用 [audio API](http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp)

播放器可以最大化和最小化

中部唱片动画使用第三方 JS 动画库 `create-keyframe-animation` 实现

底部操作区图标使用 `iconfonts`。

抽象了一个横向进度条组件和一个圆形进度条组件，横向进度条可以拖动小球和点击进度条来改变播放进度，圆形进度条组件使用 SVG `<circle>` 元素

播放模式有：顺序播放、单曲循环、随机播放，原理是调整歌单列表数组

歌词的爬取利用 `axios` 代理后端请求，伪造 `headers` 来实现，先将歌词 jsonp 格式转换为 json 格式，再使用第三方库 [`js-base64`](https://github.com/dankogai/js-base64) 进行 Base64 解码操作，最后再使用第三方库 [`lyric-parser`](https://github.com/ustbhuangyi/lyric-parser)对歌词进行格式化

实现了侧滑显示歌词、歌词跟随进度条高亮等交互效果

增加了当前播放列表组件，可在其中加入/删除歌曲

**排行页**

普通组件


**搜索页**

抓数据，写组件，另外，根据抓取的数据特征，做了上拉刷新的功能

考虑到数据量大且频繁的问题，对请求做了节流处理

考虑到移动端键盘占屏的问题，对滚动前的 `input` 做了 `blur()` 操作

对搜索历史进行了 `localstorage` 缓存，清空搜索历史时使用了改装过的 `confirm` 组件

支持将搜索的歌曲添加到播放列表

**个人中心**

将 `localstorage` 中 “我的收藏” 和 “最近播放” 反映到界面上

**其他**

此应用的全部数据来自 QQ音乐

全局通用的应用级状态使用 `vuex` 集中管理

全局引入 `fastclick` 库，消除 click 移动浏览器300ms延迟

页面是响应式的，适配常见的移动端屏幕，采用 `flex` 布局

## Build Setup

``` bash
# clone the repo into your disk.
$ git clone https://github.com/AndyTiTi/vue-music.git

# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev

# build for production with minification
$ npm run build
```

