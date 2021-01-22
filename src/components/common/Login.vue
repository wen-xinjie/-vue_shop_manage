<template>
  <div class="login-container">
    <div class="login-box">
      <h2>商品后台管理系统</h2>
      <el-form
        label-width="0px"
        :rules="loginRules"
        ref="loginFormRef"
        :model="loginFormMessages"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-dengluyonghuming"
            v-model="loginFormMessages.username"
          ></el-input>
        </el-form-item>
        <!-- 用户密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mimacopy"
            type="password"
            v-model="loginFormMessages.password"
          ></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <div class="button-box">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginFormMessages: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 调用表单验证的 API 函数
      this.$refs.loginFormRef.validate(async (valid) => {
        // valid 为 true，表示验证通过；false 表示验证不通过
        if (!valid) return;
        // 向仓库action属性中getLoginData函数中传递表单数据
        await this.$store.dispatch("getLoginData", this.loginFormMessages);
        const res = this.$store.state.loginData.data;
        if (res.meta.status !== 200) return this.$message.error("登录失败！");
        this.$message.success("登录成功！");
        console.log(res.data);
        // 将 token 存储到 sessionStorage 中
        window.sessionStorage.setItem("token", res.data.token);
        // 将 usern 存储到 sessionStorage 中
        window.sessionStorage.setItem("username", res.data.username);
        // 通过编程式导航跳转到 /home
        this.$router.push("/home");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: rgb(109, 133, 155);

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #dddddd;

    h2 {
      text-align: center;
      margin: 30px 0;
    }
  }
}

.el-form {
  padding: 10px 40px;
}

.button-box {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>