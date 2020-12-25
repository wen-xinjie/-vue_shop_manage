<template>
  <div class="roles-container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列表 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[
                'tagBottom',
                i1 === 0 ? 'tagTop' : '',
                'vcenter',
                'tagLeft',
              ]"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="moveTagsById(scope.row, item1.id)" closable>
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for循环 来渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[
                    i2 === 0 ? '' : 'tagTop',
                    'vcenter',
                    'tagLeft',
                    'tagRight',
                  ]"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="moveTagsById(scope.row, item2.id)"
                      closable
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级权限 -->
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      @close="moveTagsById(scope.row, item3.id)"
                      closable
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列表 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              class="circleBtn"
              @click="editRolesById(scope.row)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              class="circleBtn"
              @click="removeRolesById(scope.row.id)"
            ></el-button>
            <!--分配权限按钮 -->
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
                class="circleBtn"
                @click="showSetRightsDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 展示设置分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showSetRights"
      width="50%"
      @close="resetDefRights"
    >
      <!-- 展示树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defRights"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRights = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示 添加角色 对话框区域 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addRolesForm"
        :rules="addRolesRules"
        ref="addRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示 编辑角色 对话框区域 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editRolesForm"
        :rules="editRolesRules"
        ref="editRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 是否展示分配权限的对话框
      showSetRights: false,
      // 分配权限列表数据
      rightsList: [],
      // 树形控件的属性
      treeProps: {
        children: "children",
        // 看到的是哪个属性的值
        label: "authName",
      },
      // 默认勾选的权限
      defRights: [],
      // 分配权限的ID
      roleId: "",
      // 控制 添加角色 对话框显示
      addDialogVisible: false,
      // 添加角色 表单数据
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      //  添加角色 表单验证规则
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "角色名称长度在2~8个字符之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "角色描述长度在1~15个字符之间",
            trigger: "blur",
          },
        ],
      },
      // 编辑角色 表单信息
      editRolesForm: {
        id:'',
        roleDesc:'',
        roleName:''
      },
      //  控制 编辑角色对话框 显示
      editDialogVisible: false,

      // 编辑角色 表单数据验证规则
      editRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "角色名称长度在2~8个字符之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "角色描述长度在1~15个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取权限列表
    async getRolesList() {
      const { data: resp } = await this.$http.get("roles");
      if (resp.meta.status !== 200)
        return this.$message.error("获取角色列表失败！");
      this.rolesList = resp.data;
      // console.log(this.rolesList);
    },
    // 根据Id删除对应的权限
    async moveTagsById(role, rightId) {
      const result = await this.$confirm(
        "此操作将永久取消该权限, 是否继续?",
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
      const { data: resp } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (resp.meta.status !== 200) {
        return this.$message.error("取消权限失败！");
      }
      this.$message.success("取消权限成功！");
      // 重新获取用户信息
      role.children = resp.data;
    },
    // 点击按钮，设置分配权限的对话框
    async showSetRightsDialog(role) {
      const { data: resp } = await this.$http.get("rights/tree");
      if (resp.meta.status !== 200)
        return this.$message.error("获取权限列表失败！");
      this.rightsList = resp.data;
      this.roleId = role.id;

      // 通过递归函数来获取三级权限ID
      this.getCheckRightsList(role);
      // 展示设置权限列表对话框
      this.showSetRights = true;
    },
    // 通过递归函数来获取三级权限列表
    getCheckRightsList(node) {
      // 如果当前 node 节点不包含children属性，则是三级节点
      if (!node.children) {
        return this.defRights.push(node.id);
      }

      node.children.forEach((item) => this.getCheckRightsList(item));
    },
    // 关闭分配权限对话框时重置默认勾选权限列表
    resetDefRights() {
      this.defRights = [];
    },
    // 点击 确定 按钮，为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      // 用 逗号 分割数组
      const rights = keys.join(",");
      const { data: resp } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: rights,
        }
      );
      if (resp.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功！");
      // 刷新角色列表
      this.getRolesList();
      // 关闭分配权限对话框
      this.showSetRights = false;
    },
    // 点击 删除 按钮，通过ID删除角色
    async removeRolesById(id) {
      const result = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      const { data: resp } = await this.$http.delete("roles/" + id);
      if (resp.meta.status !== 200) {
        return this.$message.error("删除角色失败！");
      }
      this.$message.success("删除角色成功！");
      // 重新获取用户信息
      this.getRolesList();
    },
    // 点击确定按钮，添加角色
    async addRolesInfo() {
      this.$refs.addRolesFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: resp } = await this.$http.post(
          "roles",
          this.addRolesForm
        );
        if (resp.meta.status !== 201) {
          return this.$message.error("添加角色失败！");
        }
        this.$message.success("添加角色成功！");
        this.getRolesList();
        this.addDialogVisible = false;
      });
    },
    // 展示 编辑角色 对话框
    editRolesById(data) {
      this.editRolesForm.id = data.id
      this.editRolesForm.roleName = data.roleName;
      this.editRolesForm.roleDesc = data.roleDesc;
      this.editDialogVisible = true;
    },
    // 点击确定按钮 ，提交 编辑角色 表单数据
    async editRolesInfo() {
      this.$refs.editRolesFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: resp } = await this.$http.put(`roles/${this.editRolesForm.id}`, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc,
        });
        if (resp.meta.status !== 200) {
          return this.$message.error("修改角色失败！");
        }
        this.$message.success("修改角色成功！");
        this.getRolesList();
        this.editDialogVisible = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}

.tagTop {
  border-top: 1px solid #eee;
}
.tagBottom {
  border-bottom: 1px solid #eee;
}
.tagLeft {
  border-left: 1px solid #eee;
}
.tagRight {
  border-right: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>