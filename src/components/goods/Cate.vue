<template>
  <div class="cate">
    <!--面包屑导航-->
    <el-breadcrumb class="card_user" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!--添加分类-->
      <el-row>
        <!--添加按钮-->
        <el-col>
          <el-button type="primary" @click="addCategories">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <!--
                data 当前table数据源
                columns 表格各列的配置
                selection-type 是否为多选类型表格
                expand-type 是否为展开行类型表格
                show-index 是否显示数据索引
                index-text自定义数据索引名称
                border是否显示纵向边框                
                show-row-hover 鼠标悬停时是否高亮当前行
                -->
      <tree-table
        :data="cateGories"
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
        :show-row-hover="false"
        :columns="columns"
      >
        <!--在slot后面接受这一行数据-->
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="!scope.row.cat_deleted"
            class="el-icon-success icon_cary"
          ></i>
          <i v-else class="el-icon-error icon_error"></i>
        </template>

        <!-- 排序 -->
        <template slot="islev" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>

        <!--操作-->
        <template slot="operation" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="cateEdit(scope.row.cat_id)"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="cateDelete(scope.row.cat_id)"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <!--
                只要触发size-change就代表pagesize发生了变化
                current-change当前页码值发生变化
                -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        background
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total,sizes,prev, pager, next,jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品分类对话框 -->
    <el-dialog
      @close="setAddCateClosed"
      title="添加分类"
      :visible.sync="addCategoriesVisible"
      width="50%"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateRuleForm"
        label-width="90px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>

        <!-- 父级分类 -->
        <!-- options用来指定数据源-->
        <!-- props 用来指定配置对象 -->
        <el-form-item label="父级分类：">
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoriesVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改商品分类对话框 -->
    <el-dialog
      @close="handleCateClose"
      title="修改商品分类"
      :visible.sync="cateDialogVisible"
      width="50%"
    >
      <!-- 内容主体区域 -->
      <!--
                :rules是验证规则
            -->
      <el-form :model="cateForm" ref="cateFormRef" label-width="70px">
        <el-form-item label="分类名称">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- slot=footer底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCateCancel">取 消</el-button>
        <el-button type="primary" @click="handleCateConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "cate",
  data() {
    return {
      // 商品分类数据列表,默认为空
      cateGories: [],

      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },

      //总条数
      total: 0,

      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          //prop指定具体的值
          prop: "cat_name",
        },

        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "isok",
        },

        {
          label: "排序",
          // 表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "islev",
        },

        {
          label: "操作",
          // 表示将当前列定义为模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "operation",
        },
      ],

      // 控制添加分类对话框的显示与隐藏
      addCategoriesVisible: false,

      //添加分类的表单数据对象
      addCateForm: {
        //将要添加的分类名称
        cat_name: "",
        //父级分类的id
        cat_pid: 0,
        //默认要添加的等级是一级分类
        cat_level: 0,
      },

      //父级分类的列表
      parentCateList: [],

      // 添加分类表单的验证规则对象
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类的名称", trigger: "blur" },
        ],
      },

      //选中的父级分类的Id数组
      selectedKeys: [],

      // 已选中的商品Id值
      selectParent: "",

      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      //查询到的商品分类信息对象
      cateForm: {},

      //控制修改商品分类显示隐藏
      cateDialogVisible: false,
    };
  },

  created() {
    this.getCateGories();
  },

  methods: {
    //获取商品分类数据
    async getCateGories() {
      const { data: res } = await this.$http.get("api/categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      //把数据列表赋值给cateGories
      this.cateGories = res.data.result;
      //把总条数数据赋值给total
      this.total = res.data.total;
    },

    //监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;

      this.getCateGories();
    },

    //监听 pagenum改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      //立即刷新数据列表
      this.getCateGories();
    },

    //添加分类
    async addCategories() {
      // 先获取父级分类数据的列表
      const { data: res } = await this.$http.get("api/categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("请求商品分类数据失败");
      let dataList = res.data.filter((item, index) => {
        return index < 10;
      });
      this.parentCateList = dataList;
      // 再展示出对话框
      this.addCategoriesVisible = true;
    },

    //监听添加分类对话框的关闭事件 重置表单数据
    setAddCateClosed() {
      this.$refs.addCateRuleForm.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },

    //选择项发生变化触发这个函数
    parentCateChanged() {
      //如果selectedKeys 数组中的 length大于0证明选中了父级分类
      // 反之说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;

        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    //点击按钮添加新的分类
    confirmCate() {
      this.$refs.addCateRuleForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "api/categories",
          this.addCateForm
        );
        if (res.meta.status !== 201)
          return this.$message.error("添加新的分类失败");
        // 消息提示
        this.$message.success("添加新的分类成功");
        //刷新列表
        this.getCateGories();
        //隐藏对话框
        this.addCategoriesVisible = false;
      });
    },

    // 删除用户
    async cateDelete(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除商品分类信息, 是否继续?",
        "删除商品分类信息",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      //如果用户确认删除,则返回值为字符串confirm
      //如果用户取消了删除,则返回值为字符串cancel
      if (confirmResult !== "confirm")
        return this.$message.info("已经取消删除");
      const { data: res } = await this.$http.delete("api/categories/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除数据失败");
      //提示删除用户成功
      this.$message.success("删除商品分类信息成功");
      //刷新数据列表
      this.getCateGories();
    },

    /**修改数据 */
    async cateEdit(id) {
      const { data: res } = await this.$http.get(`api/categories/${id}`);
      //return终止出去
      if (res.meta.status !== 200)
        return this.$message.error("查询商品分类信息失败");
      this.cateForm = res.data;
      this.cateDialogVisible = true;
    },

    handleCateCancel() {
      this.cateDialogVisible = false;
    },

    handleCateConfirm() {
      this.cateDialogVisible = false;
    },

    handleCateConfirm() {
      this.$refs.cateFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请正确输入");
        //可以发起添加用户的网络请求
        const { data: res } = await this.$http.put(
          "api/categories/" + this.cateForm.cat_id,
          {
            cat_name: this.cateForm.cat_name,
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("更新商品分类信息失败");
        //隐藏用户对话框
        this.cateDialogVisible = false;
        //重新获取用户列表数据
        this.getCateGories();
        // 提示修改成功
        this.$message.success("更新商品分类信息成功");
      });
    },

    /**监听添加分类对话框的关闭事件 */
    handleCateClose() {
      this.$refs.cateFormRef.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.icon_cary {
  font-size: 20px;
  color: #7b7bff;
}
.icon_error {
  font-size: 20px;
  color: red;
}

.el-cascader {
  width: 100%;
}
</style>
