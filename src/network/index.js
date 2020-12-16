import Vue from 'vue'
// 配置 axios 请求库
import axios from 'axios'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://47.101.59.24:10001'

axios.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')

    // 在最后必须 return config
    return config
})
Vue.prototype.$http = axios