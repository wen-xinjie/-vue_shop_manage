<template>
  <el-container>
    <el-header height="50px">
      <span class="title"> 商品管理系统</span>

      <span class="userName">
        <!-- {{ $store.state.loginData&&$store.state.loginData.data.data.username }} -->
        {{ userName }}
      </span>

      <el-button type="text" @click="exitLogin" class="exitLogin">退出</el-button>
    </el-header>
    <el-container>
      <el-aside
      
        :width=" isCollapse ? '64px' : '170px'"
      >
      <!-- 接收子组件传递的是否折叠的数据并调用getCollapse函数 -->
        <NavMenu :menuList="menuList"   @navCollapse="getCollapse"/>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavMenu from "components/navMenu";
export default {
  components: {
    NavMenu,
  },
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      userName: "",
      isCollapse: true,
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
   exitLogin() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      await this.$store.dispatch("getMenu");
      const resp = this.$store.state.menuList.data;
      //  console.log(resp);
      if (resp.meta.status !== 200) return this.$message.error(resp.meta.msg);
      this.menuList = resp.data;

      // 从本地获取用户昵称
      this.userName = window.sessionStorage.getItem("username");
    },
    getCollapse(isCollapse) {
      // 保存子组件中传递的数据到data中
      this.isCollapse = isCollapse;
    },
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #464d53;
  color: #333;
  text-align: center;
  line-height: 50px;

  .title {
    font-size: 24px;
    font-weight: 500;
    color: rgb(236, 228, 228);
  }

  .userName {
    color: rgb(218, 206, 206);
    cursor: pointer;
    position: absolute;
    right: 78px;
  }

  .exitLogin {
    position: absolute;
    right: 30px;
    color: rgb(218, 206, 206);
    cursor: pointer;
    margin-top: 5px;
  }
}

.el-aside {
  height: 100%;
  background-color: #545c64;
  color: #333;
  text-align: left;
  line-height: 200px;
}
</style>