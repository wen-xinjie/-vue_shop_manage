<template>
  <div class="categories-container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类 按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序（几级） -->
        <template slot-scope="scope" slot="order">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
        </template>
        <!-- 操作 的模板 -->
        <template slot="operation" slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            class="circleBtn"
            @click="showEditDialog(scope.row.cat_id)"
          >
          </el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            class="circleBtn"
            @click="removeCateById(scope.row.cat_id)"
          ></el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加对话框区域 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoriesdialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCategoriesForm"
        :rules="addCategoriesRules"
        ref="addCategoriesFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCategoriesForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            ref="cascaderRef"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoriesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框区域 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 请求数据的参数
      queryInfo: {
        // 获取几级分类
        type: 3,
        // 当前页码
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5,
      },
      //   商品分类数据
      cateList: [],
      //   总数据条数
      total: 0,
      //   为 table 指定列的定义
      columns: [
        {
          label: "分类名称",
          //   绑定数据的属性
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用的模板名称
          template: "operation",
        },
      ],
      //  控制 添加分类 对话框展示
      addCategoriesdialogVisible: false,
      //   添加分类 的表单数据
      addCategoriesForm: {
        // 分类父 ID,默认为一级
        cat_pid: 0,
        // 分类名称
        cat_name: "",
        // 分类层级，默认为1级
        cat_level: 0,
      },
      //   添加分类 表单的验证规则
      addCategoriesRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      //   父级商品分类数据
      parentCateList: [],
      //   指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],
      //   控制编辑对话框显示
      editDialogVisible: false,
      //   添加分类 表单的验证规则
      editRules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      //   编辑 商品分类 数据
      editForm: {},
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据列表
    async getCateList() {
      const { data: resp } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (resp.meta.status !== 200)
        return this.$message.error("获取商品分类失败！");

      //   把商品分类数据保存到data中
      this.cateList = resp.data.result;
      //   保存总数据条数
      this.total = resp.data.total;
    },
    // 监听每页显示多少条数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听当前为多少页
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCateList();
    },
    // 添加分类 对话框显示
    showAddDialog() {
      // 调用获取 父级分类数据 函数
      this.getAddCateList();
      // 展示添加分类对话框
      this.addCategoriesdialogVisible = true;
    },
    // 获取点击 添加分类 按钮时的父级分类
    async getAddCateList() {
      const { data: resp } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (resp.meta.status !== 200)
        return this.$message.error("获取父级分类数据失败！");
      this.parentCateList = resp.data;
    },
    // 选择项发生改变时触发这个函数
    parentCateChange() {
      //   连级选择器面板选择后隐藏
      if (this.$refs.cascaderRef) {
        this.$refs.cascaderRef.dropDownVisible = false;
      }

      //   如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID
        this.addCategoriesForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        // 为当前分类的等级赋值
        this.addCategoriesForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        //   父级分类的ID
        this.addCategoriesForm.cat_pid = 0;
        // 为当前分类的等级赋值
        this.addCategoriesForm.cat_level = 0;
      }
    },
    // 点击 确定 按钮，提交添加分类的表单数据
    addCategories() {
      this.$refs.addCategoriesFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: resp } = await this.$http.post(
          "categories",
          this.addCategoriesForm
        );
        if (resp.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addCategoriesdialogVisible = false;
      });
    },
    // 监听 添加分类 对话框关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCategoriesFormRef.resetFields();
      this.selectedKeys = [];
      this.addCategoriesForm.cat_level = 0;
      this.addCategoriesForm.cat_pid = 0;
    },
    // 点击按钮 根据ID控制编辑对话框显示
    async showEditDialog(editId) {
      const { data: resp } = await this.$http.get("categories/" + editId);
      if (resp.meta.status !== 200)
        return this.$message.error("获取商品分类失败！");
      this.editForm = resp.data;
      this.editDialogVisible = true;
    },
    // 点击确定 提交 编辑信息
    async editCategories() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: resp } = await this.$http.put(
          `categories/${this.editForm.cat_id}`,
          {
            cat_name: this.editForm.cat_name,
          }
        );
        if (resp.meta.status !== 200) {
          return this.$message.error("编辑分类失败！");
        }
        this.$message.success("编辑分类成功！");
        this.getCateList();
        this.editDialogVisible = false;
      });
    },
    // 通过 ID 来移除商品分类
    async removeCateById(removeId) {
       const result = await this.$confirm(
        "此操作将永久删除该商品分类, 是否继续?",
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
      const { data: resp } = await this.$http.delete("categories/" + removeId);
      if (resp.meta.status !== 200) {
        return this.$message.error("删除商品分类失败！");
      }
      this.$message.success("删除商品分类成功！");
      // 重新获取用户信息
      this.getCateList();
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>