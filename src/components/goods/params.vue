<template>
  <div class="params-container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告视图区域 -->
      <el-alert
        title="注意：只允许为第三方分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="goodsCate">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类 级联选择框 区域 -->
          <el-cascader
            v-model="selectGoodsCate"
            :options="goodsCateList"
            :props="goodsCateProps"
            @change="goodsCateChange"
            ref="cascaderRef"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- 循环渲染Tag标签 -->
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                  @close="handleClosed(scope.row, i)"
                  >
                    {{ item }}
                  </el-tag>
                  <!-- 文本框输入 -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <!-- 添加标签按钮 -->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="mini"
                  class="circleBtn"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                </el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  class="circleBtn"
                  @click="removeParamsById(scope.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only"
          ><!-- 添加静态属性的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClosed(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <!-- 文本框输入 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加标签按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  size="mini"
                  class="circleBtn"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                </el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  class="circleBtn"
                  @click="removeParamsById(scope.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数属性的对话框 -->
    <el-dialog
      :title="activeName === 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数属性的对话框 -->
    <el-dialog
      :title="activeName === 'many' ? '修改动态参数' : '修改静态属性'"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类 数据列表
      goodsCateList: [],
      //   选中的 商品分类
      selectGoodsCate: [],
      //   商品分类 级联选择框 的属性
      goodsCateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //   tab 页签默认选中的激活名字
      activeName: "many",
      //   动态参数 列表数据
      manyTableData: [],
      // 静态属性 列表数据
      onlyTableData: [],
      //   控制 添加参数属性 对话框的显示与隐藏
      addDialogVisible: false,
      //   添加参数属性的表单数据
      addForm: {
        attr_name: "",
      },
      // 添加表单 的验证规则
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
      //    控制 修改参数属性对话框是否显示
      editDialogVisible: false,
      // 修改参数 对话框表单数据
      editForm: {
        attr_name: "",
      },
      //  修改参数 表单验证规则
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "请输入参数名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getGoodsCateList();
  },
  methods: {
    //获取 商品分类 列表
    async getGoodsCateList() {
      const { data: resp } = await this.$http.get("categories");
      if (resp.meta.status !== 200)
        return this.$message.error("获取商品分类失败！");
      this.goodsCateList = resp.data;
    },
    // 改变 选中 级联选择器 时触发的函数
    async goodsCateChange() {
      // 改变时触发 获取参数列表数据函数
      this.getParamsData();

      //   连级选择器面板选择后隐藏
      if (this.$refs.cascaderRef) {
        this.$refs.cascaderRef.dropDownVisible = false;
      }
    },
    //  tab 页签点击事件的处理函数
    handleTabClick() {
      // 改变时触发 获取参数列表数据函数
      this.getParamsData();
    },
    // 获取参数列表数据
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectGoodsCate.length !== 3) {
        this.selectGoodsCate = [];
        this.manyTableData = [];
        this.onlyTableData = []
        return;
      }

      // 证明选中的是三级分类
      //   根据所选分类的ID，和当前所处的面板，获取对应的参数
      const { data: resp } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );

      if (resp.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      }

      // 将attr_vals分割为数组
      resp.data.forEach((item) => {
        //   三目运算符 过滤空格字符数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];

        // 为每一个标签添加单独的 inputVisible 和 inputValue
        // 控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = "";
      });

      if (this.activeName === "many") {
        this.manyTableData = resp.data;
      } else {
        this.onlyTableData = resp.data;
      }
    },
    // 关闭 添加属性 对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定按钮 提交添加参数表单数据
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: resp } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (resp.meta.status !== 201)
          return this.$message.error("添加参数失败！");
        this.$message.success("添加参数成功！");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    // 点击 编辑按钮 展示修改参数对话框
    async showEditDialog(id) {
      // 查询当前参数信息
      const { data: resp } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (resp.meta.status !== 200)
        return this.$message.error("获取参数信息失败！");
      this.editForm = resp.data;
      this.editDialogVisible = true;
    },
    // 关闭 修改参数 对话框 重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击 确定按钮 提交 修改参数 表单数据
    editParams() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const {
          data: resp,
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (resp.meta.status !== 200)
          return this.$message.error("修改参数失败！");
        this.$message.success("修改参数成功！");
        this.editDialogVisible = false;
        this.getParamsData();
      });
    },
    //  通过ID删除商品参数
    async removeParamsById(id) {
      const result = await this.$confirm(
        "此操作将永久删除该商品参数, 是否继续?",
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
        `categories/${this.cateId}/attributes/${id}`
      );
      if (resp.meta.status !== 200) {
        return this.$message.error("删除商品分类失败！");
      }
      this.$message.success("删除商品分类成功！");
      // 重新获取参数信息
      this.getParamsData();
    },
    // Tag标签文本框失去焦点或按下 Enter 时触发的函数
    handleInputConfirm(item) {
      // 判断文本框输入内容是否合法
      // trim()方法去除字符串两边空格
      if (item.inputValue.trim().length === 0) {
        item.inputValue = "";
        item.inputVisible = false;
        return;
      }
      //   如果没有return则证明输入正确内容
      item.attr_vals.push(item.inputValue.trim());
      item.inputValue = "";
      item.inputVisible = false;
      // 需要发起请求，保存这次操作
      this.setAttrVals(item);
    },
    // 发送修改Tag标签的请求
    async setAttrVals(item) {
      const { data: resp } = await this.$http.put(
        `categories/${this.cateId}/attributes/${item.attr_id}`,
        {
          attr_name: item.attr_name,
          attr_sel: item.attr_sel,
          attr_vals: item.attr_vals.join(" "),
        }
      );

      if (resp.meta.status !== 200)
        return this.$message.error("添加参数项失败！");
      this.$message.success("添加参数项成功！");

      this.getParamsData();
    },
    // 点击添加 New Tag 按钮时触发的函数
    showInput(item) {
      item.inputVisible = true;
      //   让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的Tag标签参数可选项
    handleClosed(item, i) {
      item.attr_vals.splice(i, 1);
      this.setAttrVals(item);
    },
  },
  computed: {
    //   如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectGoodsCate.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类的ID
    cateId() {
      if (this.selectGoodsCate.length === 3) {
        return this.selectGoodsCate[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.goodsCate {
  margin: 15px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>