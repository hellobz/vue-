<template>
  <div class="params">
    <!--面包屑导航-->
    <el-breadcrumb class="card_user" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!--警告提示-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>

      <el-row>
        <el-col>
          <!-- 级联选择器 -->
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedParamsKeys"
            :options="myCateList"
            :props="paramsProps"
            @change="paramsChanged"
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs type="card" v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button
            style="margin-bottom: 20px"
            type="primary"
            size="mini"
            @click="addNature"
            :disabled="addAble"
            >添加参数</el-button
          >
          <!-- 动态参数表格 border边框 stripe隔行变色-->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!--展开行中通过作用域插槽的形式接受一下这一行的数据-->
              <template slot-scope="scope">
                <!--循环渲染tag标签-->
                <el-tag
                  style="margin: 10px"
                  closable
                  @close="handleClose(index, scope.row)"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
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
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- type指定index表示是索引列 -->
            <el-table-column type="index"> </el-table-column>

            <!-- prop指定数据属性 -->
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>

            <el-table-column label="操作">
              <!-- 通过作用域插槽形式指定数据 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="paramEdit(scope.row.attr_id)"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="paramDelete(scope.row.attr_id)"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button
            class="jt_btn"
            type="primary"
            size="mini"
            @click="addNature"
            :disabled="addAble"
            >添加属性</el-button
          >

          <!-- 静态属性表格 border边框 stripe隔行变色-->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!--展开行中通过作用域插槽的形式接受一下这一行的数据-->
              <template slot-scope="scope">
                <!--循环渲染tag标签-->
                <el-tag
                  style="margin: 10px"
                  closable
                  @close="handleClose(index, scope.row)"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
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
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- type指定index表示是索引列 -->
            <el-table-column type="index"> </el-table-column>

            <!-- prop指定数据属性 -->
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>

            <el-table-column label="操作">
              <!-- 通过作用域插槽形式指定数据 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="paramEdit(scope.row.attr_id)"
                  icon="el-icon-edit"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="paramDelete(scope.row.attr_id)"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数或者静态属性对话框 -->
    <el-dialog
      @close="setAddParamsClosed"
      :title="'添加' + titleText"
      :visible.sync="addParamsVisible"
      width="50%"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="addParamsRuleForm"
        label-width="90px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      @close="setEditParamsClosed"
      :title="'修改' + titleText"
      :visible.sync="editParamsVisible"
      width="50%"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsRules"
        ref="editParamsRuleForm"
        label-width="90px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirmParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "params",
  data() {
    return {
      //级联选择框双向绑定到的数组
      selectedParamsKeys: [],

      //分类参数的列表
      parentCateList: [],

      //商品分类列表
      myCateList: [],

      //指定级联选择器的配置对象
      paramsProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      //被激活的页签名称
      activeName: "many",

      //动态参数数据
      manyTableData: [],

      //静态属性数据
      onlyTableData: [],

      //控制添加对话框的显示与隐藏
      addParamsVisible: false,

      //添加参数的表单数据对象
      addParamsForm: {
        attr_name: "",
      },

      //添加表单的验证规则对象
      addParamsRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      //控制修改对话框的显示与隐藏
      editParamsVisible: false,

      //修改的表单数据对象
      editParamsForm: {},

      //修改表单的验证规则对象
      editParamsRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getCate();
  },

  computed: {
    //如果按钮需要被禁用则返回true,否则返回false
    addAble() {
      return this.selectedParamsKeys.length === 3 ? false : true;
    },

    // 当前选中的三级分类Id
    cateId() {
      if (this.selectedParamsKeys.length === 3) {
        return this.selectedParamsKeys[this.selectedParamsKeys.length - 1];
      }
      return null;
    },

    //动态计算标题的文本
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },

  methods: {
    // 获取商品分类所有数据
    async getCate() {
      const { data: res } = await this.$http.get("api/categories");
      if (res.meta.status !== 200)
        return this.$message.error("请求商品分类数据失败");
      let paramsData = res.data.filter((item, index) => {
        return index < 10;
      });
      this.myCateList = paramsData;
    },

    //级联选择框选中项变化,会触发这个函数
    paramsChanged() {
      //根据所选分类的Id,和当前所处的面板,获取对应的参数
      this.getClassLabel();
    },

    handleTabClick() {
      this.getClassLabel();
    },

    //发起请求
    async getClassLabel() {
      // 证明选中的不是三级分类
      if (this.selectedParamsKeys.length !== 3) {
        // 不是将数组清空
        this.selectedParamsKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      // 证明选中的是三级分类
      const { data: res } = await this.$http.get(
        "api/categories/" + this.cateId + "/attributes",
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取参数列表失败");

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //控制文本框的显示与隐藏
        item.inputVisible = false;
        // 文本框中输入的值
        item.inputValue = "";
      });

      //证明是动态参数
      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    /**点击按钮,展示修改的对话框 */
    async paramEdit(attr_id) {
      const {
        data: res,
      } = await this.$http.get(
        `api/categories/${this.cateId}/attributes/${attr_id}`,
        { params: { attr_sel: this.activeName } }
      );
      // //return终止出去
      if (res.meta.status !== 200)
        return this.$message.error("获取参数信息失败");
      // 把数据绑定到编辑的表单数据对象上
      this.editParamsForm = res.data;
      this.editParamsVisible = true;
    },

    // 删除用户
    async paramDelete(attr_id) {
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

      // //如果用户确认删除,则返回值为字符串confirm
      // //如果用户取消了删除,则返回值为字符串cancel
      if (confirmResult !== "confirm")
        return this.$message.info("已经取消删除");
      const { data: res } = await this.$http.delete(
        `api/categories/${this.cateId}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除参数失败");
      // //提示删除用户成功
      this.$message.success("删除参数成功");
      // //刷新数据列表
      this.getClassLabel();
    },

    //点击显示对话框
    addNature() {
      this.addParamsVisible = true;
    },

    //监听添加对话框的关闭事件
    setAddParamsClosed() {
      this.$refs.addParamsRuleForm.resetFields();
    },

    //点击按钮 添加参数
    confirmParams() {
      //  预验证
      this.$refs.addParamsRuleForm.validate(async (valid) => {
        if (!valid) return;

        const {
          data: res,
        } = await this.$http.post(`api/categories/${this.cateId}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName,
        });
        if (res.meta.status !== 201)
          return this.$message.error("添加分类参数失败");
        //提示
        this.$message.success("添加分类参数成功");
        //隐藏
        this.addParamsVisible = false;
        //刷新
        this.getClassLabel();
      });
    },

    setEditParamsClosed() {
      //清空表单 重置修改的表单
      this.$refs.editParamsRuleForm.resetFields();
    },

    //点击按钮,修改参数信息
    editConfirmParams() {
      this.$refs.editParamsRuleForm.validate(async (valid) => {
        if (!valid) return;
        /**
            :id 分类Id this.cateId
            :attr_id  属性ID this.editParamsForm.attr_id
            attr_name 新属性的名字 this.editParamsForm.attr_name
            attr_sel  属性的类型 this.activeName

           */
        const {
          data: res,
        } = await this.$http.put(
          `api/categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("修改参数失败");
        //提示
        this.$message.success("修改参数成功");
        //刷新列表
        this.getClassLabel();
        //隐藏对话框
        this.editParamsVisible = false;
      });
    },

    //   文本框失去焦点或摁下了 enter都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
        //length=0了不用做后续处理了，直接return
      }
      //如果没有return,输入了真实的内容,做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //需要发起请求,保存这次操作
      this.saveAttrVals(row);
    },

    //将对attr_vals操作保存到数据库
    async saveAttrVals(row) {
      const {
        data: res,
      } = await this.$http.put(
        `api/categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) return this.$message.error("修改参数项失败");
      this.$message.success("修改参数项成功");
    },

    //点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick 方法的作用 就是当页面上元素被
      //重新渲染之后才会执行回调函数中的代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //删除对应的参数可选项
    handleClose(index, row) {
      row.attr_vals.splice(index, 1);
      this.saveAttrVals(row);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 20px;
}

.jt_btn {
  margin-bottom: 20px;
}

.input-new-tag {
  width: 120px;
}
</style>
