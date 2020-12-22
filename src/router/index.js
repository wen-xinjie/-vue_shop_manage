import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from 'views/Home'
import Login from '../components/Login.vue'
import Welcome from 'components/welcome.vue'
import Users from 'components/user/Users.vue'
import Rights from 'components/power/Rights'
import Roles from 'components/power/Roles'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome,
      },
      {
        path:'/users',
        component:Users,
      },
      {
        path:'/rights',
        component:Rights,
      },
      {
        path:'/roles',
        component:Roles,
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component:Login
  },
 
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
