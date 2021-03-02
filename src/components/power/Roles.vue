<template>
    <div class="roles">
        <!--面包屑导航-->
        <el-breadcrumb class="card_user" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="handleAddActor">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="actorlist" border stripe>
                <!-- 展开列 只要加type="expand就能设置展开列" -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 栅格系统 -->
                        <el-row :class="['bdbottom','vcenter',i1 === 0?'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <!-- 一级权限占5列 -->
                            <el-col :span="5">
                                <el-tag @close="handleCloseTag(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row :class="['vcenter',i2 === 0?'':'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag @close="handleCloseTag(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>

                                    <el-col :span="18">                                        
                                        <el-tag @close="handleCloseTag(scope.row,item3.id)" closable type="warning" v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
               
                    </template>

                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index">
                </el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>            
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <!-- {{scope.row}} -->
                        <el-button type="primary" @click="handleActorEdit(scope.row.id)" size="mini" icon="el-icon-edit">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" size="mini" @click="handleActorDelete(scope.row.id)" icon="el-icon-delete">删除</el-button>
                        <!-- 分配权限按钮 -->
                        <el-button type="warning" @click="showSetRightDialog(scope.row)" size="mini" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 添加角色区域 -->
            <el-dialog
        @close="handleActorClose"
        title="添加用户"
        :visible.sync="actorVisible"
        width="50%"
        
        >
            <!-- 内容主体区域 -->
            <!--
                :rules是验证规则

            -->
            <el-form :model="actorForm" :rules="actorFormRules" ref="actorFormRef" label-width="70px">
                <el-form-item label="角色ID" prop="roleId">
                    <el-input v-model="actorForm.roleId"></el-input>
                </el-form-item>

                <el-form-item label="角色名称">
                    <el-input  v-model="actorForm.roleName"></el-input>
                </el-form-item>

                <el-form-item label="角色描述">
                    <el-input v-model="actorForm.roleDesc"></el-input>
                </el-form-item>
            
            </el-form>
            <!-- slot=footer底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleActorCancel">取 消</el-button>
                <el-button type="primary" @click="handleActorConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改数据对话框 -->
        <el-dialog
        @close="handleEditActorClose"
        title="修改角色信息"
        :visible.sync="editActorVisible"
        width="50%"
        >
            <!-- 内容主体区域 -->
            <!--
                :rules是验证规则
            -->
            <el-form :model="editActorForm" :rules="editActorFormRules" ref="editActorFormRef" label-width="70px">
                <el-form-item label="角色Id">
                    <el-input v-model="editActorForm.roleId" disabled></el-input>
                </el-form-item>

                <el-form-item label="角色名称">
                    <el-input v-model="editActorForm.roleName"></el-input>
                </el-form-item>

                <el-form-item label="角色描述">
                    <el-input v-model="editActorForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- slot=footer底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleEidtActorCancel">取 消</el-button>
                <el-button type="primary" @click="handleEidtActorConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色权限 -->
        <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
        >
        <!-- 树形控件 -->
        <!-- :props指定树形绑定的字段 -->
        <el-tree :data="rightslist" :props="treeProps" :default-checked-keys="defKeys" default-expand-all node-key="id" show-checkbox ref="treeRef"></el-tree>

        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
        </el-dialog>

        </el-card>

    </div>
</template>

<script>
export default {
    name: 'roles',
    data(){
        // 自定义添加角色ID校验规则
        var checkID = (rule, value, callback) => {
        //验证邮箱的正则表达式
        const regId = /^\d+/
        if (regId.test(value)) {
          //合法邮箱
          return callback();
        }

        callback(new Error('请输入合法的角色ID要求为数字'));
        
      };

        return{
            //角色数据
            actorlist: [],

            //添加角色数据
            actorForm:{
                roleId: '',
                roleName: '',
                roleDesc: ''
            },

            //添加表单的验证规则对象
            actorFormRules: {                
                //验证角色ID是否合法
                 roleId: [
                    { required: true, message: '请输入角色ID', trigger: 'blur' },
                    { validator: checkID, trigger: 'blur' }
                ]
            },

            //关闭与否
            actorVisible: false,

            //查询到的角色信息对象
            editActorForm: {

            }, 

            //修改表单的验证规则对象
            editActorFormRules: {                  
                 //验证角色ID是否合法
                 roleId: [
                    { required: true, message: '请输入角色ID', trigger: 'blur' },
                    { validator: checkID, trigger: 'blur' }
                ]
            },

            //关闭与否
            editActorVisible: false,

            //控制分配权限对话框的显示与隐藏
            setRightDialogVisible: false,

            //所有权限的数据
            rightslist:[],

            //children代表我们实现父子嵌套用的哪一个属性
            // label代表前面看到的文本是哪一个字段
            //树形控件的属性绑定对象
            treeProps: {
                children: 'children',
                label: 'authName'
            },

            //默认选中的节点Id值数组
            defKeys: [],

            //id
            roleMyId: ''
        }
    },

    created(){
        this.getActorList();
    },

    methods:{
        //获取所有角色的列表
        async getActorList(){
            const {data: res} = await this.$http.get("api/roles");
            if(res.meta.status !== 200) return this.$message.error("获取角色列表失败");
            this.actorlist = res.data;
        },

        //添加角色              
         handleAddActor(){
             this.actorVisible = true;
         },

        //角色关闭事件
        handleActorClose(){
            this.$refs.actorFormRef.resetFields();
            this.actorForm = {};
        },

        // 添加角色取消事件
        handleActorCancel(){
            this.actorVisible = false;
        },

        //添加角色确定事件
        handleActorConfirm(){
            this.$refs.actorFormRef.validate(async valid=>{
                if(!valid) return this.$message.error('请正确输入');
                //可以发起添加用户的网络请求
                const {data: res} = await this.$http.post('api/roles',this.actorForm);
                if(res.meta.status !== 201) return this.$message.error('添加角色信息失败');
                this.$message.success("添加角色信息成功");
                //隐藏用户对话框
                this.actorVisible = false;
                //重新获取用户列表数据
                this.getActorList();
            })  
        },

        //编辑角色
        async handleActorEdit(id){
            const {data: res} = await this.$http.get(`api/roles/${id}`);
            //return终止出去
            if(res.meta.status !== 200) return this.$message.error('查询角色信息失败');
            this.editActorForm = res.data;            
            this.editActorVisible = true;
        },

        // 编辑角色关闭事件
        handleEditActorClose(){
            this.$refs.editActorFormRef.resetFields();
        },

        // 编辑角色取消事件
        handleEidtActorCancel(){
             this.editActorVisible = false  
        },

        //编辑角色确定事件
        async handleEidtActorConfirm(){
            this.$refs.editActorFormRef.validate(async valid=>{
                if(!valid) return this.$message.error('请正确输入');
                //可以发起添加用户的网络请求
                const {data: res} = await this.$http.put('api/roles/'+this.editActorForm.roleId,{
                    roleName: this.editActorForm.roleName,
                    roleDesc: this.editActorForm.roleDesc
                });
                if(res.meta.status !== 200) return this.$message.error('更新用户信息失败');                
                //隐藏用户对话框
                this.editActorVisible = false;
                //重新获取用户列表数据
                this.getActorList();
                // 提示修改成功
                this.$message.success("更新用户信息成功");
            })
        },

         // 删除角色
        async handleActorDelete(id) {
            // 弹框询问用户是否删除数据
            const confirmActorResult = await this.$confirm('此操作将永久删除角色信息, 是否继续?', '删除角色信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=> err     
            );

            //如果用户确认删除,则返回值为字符串confirm
            //如果用户取消了删除,则返回值为字符串cancel            
            if(confirmActorResult !== 'confirm') return this.$message.info('已经取消删除');
            const {data: res} = await this.$http.delete('api/roles/'+id);
            if(res.meta.status !== 200) return this.$message.error('删除数据失败');
            //提示删除用户成功
            this.$message.success('删除用户成功');
            //刷新数据列表
            this.getActorList();

      },

      //根据id删除对应权限
      async handleCloseTag(role,rightId){
           // 弹框询问用户是否删除数据
            const confirmActorResult = await this.$confirm('此操作将永久删除角色信息, 是否继续?', '删除角色信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=> err     
            );

            //如果用户确认删除,则返回值为字符串confirm
            //如果用户取消了删除,则返回值为字符串cancel            
            if(confirmActorResult !== 'confirm') return this.$message.info('已经取消删除');
            const {data: res} = await this.$http.delete('api/roles/'+role.id+'/rights/'+rightId)
            if(res.meta.status !== 200) return this.$message.error('删除权限失败');
            // 获取最新权限列表
            role.children = res.data;
          //不建议请求数据会导致页面刷新，合起来
        //   this.getActorList();
            //提示删除用户成功
            this.$message.success('删除用户成功');

        //   this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(async () => {
        //   const {data: res} = await this.$http.delete('api/roles/'+role+'/rights/'+rightId)
        //   if(res.meta.status !== 200) return this.$message.error('删除权限失败');
        //   //获取最新权限列表
        //   role.children = res.data;
        //   //不建议请求数据会导致页面刷新，合起来
        // //   this.getActorList();
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功!'
        //   });
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });          
        // });
      },

      //展示分配权限的对话框
      async showSetRightDialog(role){
          this.roleMyId = role.id;
          const {data: res} = await this.$http.get("api/rights/tree");
          if(res.meta.status !== 200) return this.$message.error('获取权限数据失败');
          //把获取到的权限数据保存到data中
          this.rightslist = res.data;

        //   递归获取三级节点的Id
          this.getLeafKeys(role,this.defKeys)

          this.setRightDialogVisible = true;
      },

      //通过递归的形式,获取角色下所有三级权限的id,并保存到defKeys数组中
      getLeafKeys(node,arr){
          //如果当前node节点不包含children属性，则是三级节点
          if(!node.children){
              return arr.push(node.id)
          }

        //   不是三级节点采用递归
        // 自己调用自己就是递归 重复来一次
        node.children.forEach(item=>{
            this.getLeafKeys(item,arr)
        })
      },

      //监听分配权限对话框的关闭事件
      setRightDialogClosed(){
          this.defKeys = []
      },

      //点击为角色分配权限
      async allotRights(){
          const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()];
          const idStr = keys.join(',');
          const {data: res} = await this.$http.post('api/roles/'+this.roleMyId+'/rights',{rids:idStr})
          if(res.meta.status !== 200) return this.$message.error('分配权限失败');
          //弹框提示
          this.$message.success('分配权限成功');
          //刷新列表
          this.getActorList();
          //隐藏
          this.setRightDialogVisible = false
      },
           
    }
}
</script>

<style lang="scss" scoped>
    .el-row {
        margin-bottom:0;
    }
    .el-tag {
        margin: 7px;
        
    }
    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    /**纵向的居中对齐 */
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>