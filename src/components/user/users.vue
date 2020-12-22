<template>
  <div class="users-container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <!-- 用插槽来获取这一行的数据，并且双向绑定到开关键 -->
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              class="circleBtn"
              @click="editeUser(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              class="circleBtn"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
                class="circleBtn"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserVisible"
      width="50%"
      center
      @close="addDialogClosed"
    >
      <!-- 添加用户的主体区域 -->
      <el-form
        label-width="70px"
        :rules="addUserRules"
        ref="addFormRef"
        :model="addUserInfo"
        status-icon
      >
        <!-- 用户名 -->
        <el-form-item prop="username" label="用户名">
          <el-input v-model="addUserInfo.username"></el-input>
        </el-form-item>
        <!-- 用户密码 -->
        <el-form-item prop="password" label="密码">
          <el-input v-model="addUserInfo.password"></el-input>
        </el-form-item>
        <!-- 用户邮箱 -->
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="addUserInfo.email"></el-input>
        </el-form-item>
        <!-- 用户手机号码 -->
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="addUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户信息的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editeUserVisible"
      width="50%"
      center
      @close="editeDialogClosed"
    >
      <!-- 编辑用户的主体区域 -->
      <el-form
        label-width="80px"
        :rules="editeUserRules"
        ref="editeFormRef"
        :model="editeForm"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名">
          <el-input v-model="editeForm.username" disabled></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editeForm.email"></el-input>
        </el-form-item>
        <!-- 手机号码 -->
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editeForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editeUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editeUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close="closeRoleDialog"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前用户的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRole" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChoseRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱规则的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    // 验证手机规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机规则的正则表达式
      const regMobile = /^(0|86}17951)?(13[0-9]|15[123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("请输入合法手机号码"));
    };

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 查询参数
        query: "",
        // 当前页码
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 4,
      },
      userList: [],
      total: 0,

      // 添加用户表单信息
      addUserInfo: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户的对话是否显示
      addUserVisible: false,
      // 添加用户表单信息的错误提示
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 编辑用户的对话框是否显示
      editeUserVisible: false,
      // 查询到的 编辑 部分用户信息
      editeForm: {},
      // 编辑用户表单信息的错误提示
      editeUserRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制分配角色对话框显示
      roleDialogVisible: false,
      // 需要被分配角色的角色用户信息
      userInfo: [],
      // 所有角色的数据列表
      rolesList: [],
      // 被选中的角色数据
      selectedRole: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表信息
    async getUserList() {
      const { data: resp } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (resp.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.userList = resp.data.users;
      this.total = resp.data.total;
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听 switch 开关状态的改变
    async userStateChange(userinfo) {
      const { data: resp } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (resp.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户失败！");
      }
      this.$message.success("更新成功！");
    },
    // 监听 添加 用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击 确定 按钮 ，添加 新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加用户请求
        const { data: resp } = await this.$http.post("users", this.addUserInfo);
        if (resp.meta.status !== 201) {
          return this.$message.error("添加新用户失败！");
        }
        this.$message.success("添加新用户成功！");
        // 隐藏添加用户的对话框
        this.addUserVisible = false;
        // 重新获取用户信息
        this.getUserList();
      });
    },
    // 点击 编辑 按钮，编辑用户信息
    async editeUser(userId) {
      console.log(userId);
      const { data: resp } = await this.$http.get("users/" + userId);
      if (resp.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.editeForm = resp.data;
      console.log(resp);
      this.editeUserVisible = true;
    },
    // 监听 编辑 用户对话框的关闭事件
    editeDialogClosed() {
      this.$refs.editeFormRef.resetFields();
    },
    // 点击 确定按钮 ，修改用户信息
    editeUserInfo() {
      this.$refs.editeFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加用户请求
        const { data: resp } = await this.$http.put(
          "users/" + this.editeForm.id,
          {
            email: this.editeForm.email,
            mobile: this.editeForm.mobile,
          }
        );
        if (resp.meta.status !== 200) {
          return this.$message.error("修改新用户失败！");
        }
        this.$message.success("修改新用户成功！");
        // 隐藏添加用户的对话框
        this.editeUserVisible = false;
        // 重新获取用户信息
        this.getUserList();
      });
    },
    // 通过用户 ID 来删除用户
    async removeUserById(id) {
      const result = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认了删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (result !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: resp } = await this.$http.delete("users/" + id);
      if (resp.meta.status !== 200) {
        return this.$message.error("删除新用户失败！");
      }
      this.$message.success("删除新用户成功！");
      // 重新获取用户信息
      this.getUserList();
    },
    // 分配角色对话框
    async setRole(userinfo) {
      this.userInfo = userinfo;
      // 获取所有角色列表
      const { data: resp } = await this.$http.get("roles");
      this.roleDialogVisible = true;
      if (resp.meta.status !== 200)
        return this.$message.error("获取角色列表失败！");
      this.rolesList = resp.data;
    },
    // 保存分配角色信息
    async saveChoseRole() {
      if (!this.selectedRole) {
        this.$message.error("请选择要分配的角色！");
      }
      const { data: resp } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRole,
        }
      );
      if (resp.meta.status !== 200)
        return this.$message.error("修改角色失败！");
      this.$message.success("修改角色成功！");
      this.getUserList();
      this.roleDialogVisible = false;
    },
    // 关闭分配角色对话框
    closeRoleDialog(){
      this.selectedRole = "";
      this.userinfo = "";
    }
  },
};
</script>

<style lang="less" scoped>
.circleBtn {
  margin: 0 4px;
}
</style>