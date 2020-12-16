import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginData: '',
    menuList: '',
  },
  mutations: {
    // 赋值登录data数据
    setLoginData: (state, data) => {
      state.loginData = data;
    },

    // 赋值菜单数据
    setMenu: (state, data) => {
      state.menuList = data;
    }
  },
  actions: {
    // 获取登录data数据
    async getLoginData(context, msg) {
      const resp = await axios.post(
        "/login",
        msg
      )
      // 通过mutations来更改state数据
      context.commit("setLoginData", resp);
    },

    // 获取菜单数据
    async getMenu(context) {
      const resp = await axios.get("/menus");
      // console.log(resp);
      context.commit("setMenu", resp);
    }
  },
  modules: {
  }
})
