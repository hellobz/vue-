<template>
  <div class="add">
    <!--面包屑导航-->
    <el-breadcrumb class="card_user" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      >
      </el-alert>

      <!--步骤条-->
      <!-- :active用来指定激活项的索引 -->
      <el-steps
        align-center
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <!-- tab栏标签页 -->
        <!-- tabs和tab-pane不允许嵌套其它的 -->
        <!-- v-model指定激活的是哪个面板 -->
        <el-tabs
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          :tab-position="tabPosition"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- prop就是校验规则 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="goods_cat">
              <!-- :options是指定数据源
                                  :props级联选择器的配置项
                              -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group
                v-for="(subItem, subIndex) in item.attr_vals"
                :key="subIndex"
                v-model="item.attr_vals"
              >
                <el-checkbox :label="subItem" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action是上传图片要请求后台的api接口 -->
            <!-- :on-preview指定预览的事件的 -->
            <!-- :on-remove单击x号时候处理事件 -->
            <!-- :file-list指定文件列表的,不需要文件列表,直接在文件选择就可以 -->
            <!-- list-type可以指定预览组件的呈现方式 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="successUpload"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>

            <!-- 添加商品 -->
            <el-button class="add_goods" @click="add" type="primary"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" style="width:100%" />
    </el-dialog>
  </div>
</template>
<script>
//官方建议导入的时候命名下划线
import _ from "lodash";
export default {
  name: "add",
  data() {
    return {
      //激活项的索引
      activeIndex: "0",

      //tab标签页位置
      tabPosition: "left",

      //添加商品的表单数据对象
      addForm: {
        // 商品名称
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],

        //上传图片的临时路径
        pics: [],

        //商品的详情描述
        goods_introduce: "",

        attrs: [],
      },

      //添加商品的表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      //所有商品分类数据
      catelist: [],

      cateProps: {
        //看到的是哪个属性
        label: "cat_name",
        //选中的是哪个值
        value: "cat_id",
        //哪个属性实现父子节点嵌套
        children: "children",
      },

      //分类Id也就是选择的三级分类Id

      //动态参数列表数据
      manyTableData: [],

      //静态属性数据
      onlyTableData: [],

      //指定上传图片的url地址
      uploadUrl: "http://127.0.0.1:9999/api/private/v1/upload",

      //图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("tomanmanken"),
      },

      previewPath: "",

      previewVisible: false,
    };
  },

  created() {
    this.getShop();
  },

  methods: {
    // 获取所有商品分类数据
    async getShop() {
      const { data: res } = await this.$http.get("api/categories");
      if (res.meta.status !== 200)
        return this.$message.error("请求商品分类数据失败");
      const dataList = res.data.filter((item, index) => {
        return index < 10;
      });
      this.catelist = dataList;
    },

    //级联选择器选中项变化会触发这个函数
    handleChange() {
      // 直接判断length等不等于3,不等于3直接清空
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },

    beforeTabLeave(activeName, oldActiveName) {
      // 只要return false就阻止标签页的切换
      if (activeName !== "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },

    async tabClicked() {
      //访问的是动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `api/categories/${this.cat}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取动态参数数据失败");
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `api/categories/${this.cat}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("获取静态属性失败");
        this.onlyTableData = res.data;
      }
    },

    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },

    //处理移除图片的操作
    handleRemove(file) {
      //1.获取将要删除的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从pics数组中找到这个图片对应的索引值
      const idx = this.addForm.pics.findIndex((x) => x.pic === filePath);
      // 3.调用数组的splice方法,将图片信息对象,从pics数组中移除
      this.addForm.pics.splice(idx, 1);
    },

    //监听图片上传成功的事件
    successUpload(response) {
      //1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2.将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo);
    },

    //添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写表单必要的项!");
        //执行添加的业务逻辑
        //lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        //处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };

          this.addForm.attrs.push(newInfo);
        });

        //处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;

        //发起请求添加商品
        // 商品的名称必须是唯一的
        const { data: res } = await this.$http.post("api/goods", form);
        if (res.meta.status !== 201)
          return this.$message.error("添加商品失败!");
        this.$message.success("添加商品成功!");
        this.$router.push("/goods");
      });
    },
  },

  computed: {
    cat() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.add_goods {
  margin-top: 20px;
}
// .checkbox {
//     margin:0 10px 0 0 !important;
// }
</style>
