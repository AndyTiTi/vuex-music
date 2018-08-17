import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

//移动端调试工具，打包上线时注释
// import vConsole from 'vconsole'
//引导页
import VueTouch from 'vue-touch'

//解决移动端 点击300毫秒延迟问题
fastclick.attach(document.body)

Vue.use(VueTouch, { name: 'v-touch' })

//图片懒加载
Vue.use(VueLazyload,{
  loading: require('common/image/default.png')
})

Vue.config.productionTip = false

import 'common/stylus/index.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
