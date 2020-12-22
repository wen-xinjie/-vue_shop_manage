<template>
  <el-col :span="12" :width="isCollapse ? '50%' : '100%'">
    <div class="toggle-button">
      <el-tooltip
        effect="dark"
        :content="isCollapse ? '点击展开' : '点击收缩'"
        placement="right"
          :enterable="false"
      >
        <span
          :class="{
            'toggle-button-icon': true,
            'iconfont icon-solid-home': true,
          }"
          @click="navCollapse"
        >
        </span>
      </el-tooltip>
    </div>
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
      isCollapse: true,
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
  background-color: #545c64;
  height: 28px;
  color: #909399;
  line-height: 28px;
  padding: 3px 0;
  text-align: center;
}
.toggle-button-icon {
  width: 28px;
  height: 100%;
  display: inline-block;
  border-radius: 50%;
  text-align: center;
  outline: none;
}
.toggle-button-icon:hover {
  background-color: #75797e;
  outline: none;
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

.icon-solid-home {
  font-size: 15px;
}
</style>