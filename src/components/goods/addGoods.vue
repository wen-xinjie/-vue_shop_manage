<template>
  <div class="addGoods-container">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/goods' }">返回</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 警告视图区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签页 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="onTabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="onCateChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到的后台API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
           <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" width="50%" :visible.sync="previewVisible">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      // 进度条激活状态
      activeIndex: 0,
      //   添加商品表单数据
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_cat: "",
        // 上传的图片临时路径（对象）
        pics: [],
        // 商品的详细描述
        goods_introduce: "",
        attrs:[],
      },
      //   添加商品表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      //   商品分类数据列表
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        children: "children",
        label: "cat_name",
        value: "cat_id",
      },
      //   动态参数数据列表
      manyTableData: [],
      //   静态属性数据列表
      onlyTableData: [],
      //   图片上传的地址
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //   图片预览
      previewPath: [],
      // 控制图片预览对话框是否显示
      previewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data: resp } = await this.$http.get("categories");
      if (resp.meta.status !== 200)
        return this.$message.error("获取商品分类失败！");
      this.cateList = resp.data;
    },
    // 点击级联选择器触发的函数
    onCateChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 标签页跳转前执行的函数
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！");
        return false;
      }
    },
    // 商品参数数据请求
    async onTabClick() {
      // 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        const { data: resp } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (resp.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败！");
        }
        resp.data.forEach((item) => {
          const attrString = item.attr_vals;
          if (attrString.trim().length === 0) {
            item.attr_vals = [];
            item.options = [];
          } else {
            item.attr_vals = attrString.split(",");
            item.options = attrString.split(",");
          }
        });
        this.manyTableData = resp.data;
        console.log(resp.data);
      } else {
        const { data: resp } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (resp.meta.status !== 200) {
          return this.$message.error("获取静态属性列表失败！");
        }
        this.onlyTableData = resp.data;
        console.log(this.onlyTableData);
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // 1、获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2、从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      // 3、调用数组中的splice方法，把图片信息对象从pics数组中移除
      this.addForm.pics.splice(i, 1);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // 1、拼接得到一个图片信息对象
      const picsInfo = { pic: response.data.tmp_path };
      // 2、将图片信息对象，push到 PICS数组中
      this.addForm.pics.push(picsInfo);
    },
    // 点击添加按钮，提交表单数据
    addGoods(){
        this.$refs.addFormRef.validate(async valid => {
            if(!valid) return
            // 执行添加的业务逻辑
            // lodash cloneDeep(obj) 深拷贝表单
            const form = _.cloneDeep(this.addForm)
            form.goods_cat = form.goods_cat.join(',')
            // 处理动态参数
            this.manyTableData.forEach(item => {
                const newInfo = {
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals.join('')
                }
                this.addForm.attrs.push(newInfo)
            })
            // 处理静态属性
            this.onlyTableData.forEach(item => {
                const newInfo = {
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals
                }
                this.addForm.attrs.push(newInfo)
            })
            form.attrs = this.addForm.attrs

            // 发起请求添加商品
            // 商品的名称，名称必须是唯一的
            const {data:resp} = await this.$http.post('goods',form)
            if(resp.meta.status !== 201){
                return this.$message.error('添加商品失败！')
            }
            this.$message.success('添加商品成功！')
            this.$router.push('/goods')
        })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-input {
  width: 980px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
/deep/ .ql-editor {
  min-height: 300px;
}
.btnAdd{
    margin: 20px 0;
}
</style>