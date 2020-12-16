<template>
  <el-col :span="12" :width="isCollapse ? '50%' : '100%'">
    <div
      :class="{
        'toggle-button': true,
        'iconfont icon-cebianlan-copy': isCollapse,
        'iconfont icon-cebianlan': !isCollapse,
      }"
      @click="navCollapse"
    ></div>
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409eff"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="activePath"
    >
      <!-- 一级菜单 -->
      <!-- +''是为了转化为字符串 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="menuIcons[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/' + childitem.path"
          v-for="childitem in item.children"
          :key="childitem.id"
          @click="saveNavActive('/' + childitem.path)"
        >
          <template slot="title">
            <i class="el-icon-menu icon-menu" style="font-size: 14px"></i>
            <span>{{ childitem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-col>
</template>

<script>
export default {
  props: {
    menuList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      menuIcons: {
        125: "iconfont icon-dashujukeshihuaico-",
        103: "iconfont icon-BBDhezi",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-icon",
        145: "iconfont icon-shuju-dianji",
      },
      // 侧边栏是否折叠
      isCollapse: false,
      // 被激活的菜单地址
      activePath: "",
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    // 点击按钮，切换菜单的折叠与展开
    navCollapse() {
      this.isCollapse = !this.isCollapse;
      // 向父组件传递是否折叠的数据
      this.$emit("navCollapse", this.isCollapse);
    },
    // 点击菜单栏，在本地保存菜单激活状态
    saveNavActive(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.toggle-button {
  background-color: #5e6369;
  height: 25px;
  color: #35383b;
  line-height: 25px;
  text-align: center;
}

.el-menu {
  border-right: none;
}

.el-col {
  width: 100%;
  background-color: #fff;
}

.iconfont {
  margin-right: 10px;
  font-size: 13px;
}

.icon-cebianlan,
.icon-cebianlan-copy {
  margin-right: 0px;
  font-size: 16px;
}
</style>