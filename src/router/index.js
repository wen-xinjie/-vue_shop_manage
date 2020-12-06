import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from 'views/Home'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component:Login
  },
  // {
  //   path: '/about',
  //   name: 'About',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

// 挂载路由导航守卫
router.beforeEach((to,from,next) => {
  // to将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //  next() 放行 next('/login') 强制跳转

  if(to.path === '/login') return next();
  // 获取token
  const tokenStr =  window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
