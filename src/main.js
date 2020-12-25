import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'
import './network/index'

import 'assets/css/common.css'

// 导入依赖
import TreeTable from 'vue-table-with-tree-grid'


Vue.config.productionTip = false

// 注册为全局可用属性
Vue.component('tree-table',TreeTable)

// // 配置 axios 请求库
// import axios from 'axios'

// // 配置请求的根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
