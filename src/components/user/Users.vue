<template>
    <div class="users">
        <!--面包屑导航-->
        <el-breadcrumb class="card_user" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>            
            <!--栅格系统 gutter是间隙-->
            <el-row :gutter="20">
                <el-col :span="9">
                    <!--搜索内容-->
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="handleAddUser">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <!-- 如何使用布尔值转开关 就用到作用域插槽了 -->
            <el-table :data="userlist" border stripe="">
                <!-- 设置索引列 -->
                <el-table-column type="index"></el-table-column>
                <!-- label指向当前列标题 prop指向当前列数据 -->
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <!-- 在状态这一列你只要通过作用域插槽接受了下scope
                    就可以通过scope.row这个属性 -->

                    <!-- 作用域插槽会覆盖prop -->
                    <template slot-scope="scope">                
                        <el-switch
                            @change="userStateChanged(scope.row)"
                            v-model="scope.row.mg_state"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                            
                            </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <!-- {{scope.row}} -->
                        <el-button type="primary" @click="handleEdit(scope.row.id)" size="mini" icon="el-icon-edit"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" icon="el-icon-delete"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top-start">
                            <el-button type="warning" size="mini" icon="el-icon-setting" @click="handleOpenRole(scope.row)"></el-button>
                        </el-tooltip>
                        
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <!-- current-page当前显示的是第几页的数据 -->
            <!-- page-sizes下拉菜单可以看见有几项的选项 -->
            <!-- page-size当前情况下每页显示多少条数据 -->
            <!-- layout作用页面上需要展示哪些功能组件 total共多少条 -->
            <!-- sizes是每页显示多少条的选择菜单
            total总共有多少条数据 -->
            <!-- layout作用就是页面上都显示哪些布局结构 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                background
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total,sizes,prev, pager, next,jumper"
                :total="total">
            </el-pagination>

            <!-- 刷新后没有保存是因为只在前台设置了打开 
            但是并没有把状态的修改同步到数据库中 -->

            <!--同步到数据库
            第一步监听switch状态开关的改变
            从而拿到最新的状态

            第二步要调用对应的api接口
            以此最新的状态保存到数据库中

            如何监听switch开关的改变
            change switch状态发生改变的时候回调用这个事件
            -->


        </el-card>

        <!-- 添加用户弹出对话框 -->
        <!--
            title标题提示
            :visible属性绑定用来
            控制对话框的显示和隐藏
            :before-close 对话框
            关闭之前会触发这个事件
        -->

        <!--为dialog弄关闭事件-->

        <el-dialog
        @close="handleClose"
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        >
            <!-- 内容主体区域 -->
            <!--
                :rules是验证规则

            -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addForm.password"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>

                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- slot=footer底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改数据对话框 -->
        <el-dialog
        @close="handleEditClose"
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        >
            <!-- 内容主体区域 -->
            <!--
                :rules是验证规则
            -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>

                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- slot=footer底部按钮区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleEidtCancel">取 消</el-button>
                <el-button type="primary" @click="handleEidtConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!--分配角色对话框-->
        <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleAllotClosed"
        >
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的角色：{{userInfo.role_name}}</p>
                <p>分配新角色：
                     <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                        v-for="item in rolesList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
  </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'users',
    data(){
        // 自定义添加用户邮箱校验规则
        var checkEmail = (rule, value, callback) => {
        //验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          //合法邮箱
          return callback();
        }

        callback(new Error('请输入合法的邮箱'));
        
      };

      //验证手机号的规则
      var checkMobile  = (rule, value, callback) => {
        const regPhone = /^(0|86|17951)?1[3456789]\d{9}$/
        if (regPhone.test(value)) {
            //合法手机号
          return callback();
        }
        callback(new Error('请输入合法的手机号'));
      };

        return{  
            //查询到的用户信息对象
            editForm: {

            },          

            //修改表单的验证规则对象
            editFormRules: {                  
                //验证邮箱是否合法
                 email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],

                //验证手机号是否合法
                 mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },

            // 修改用户数据
            editDialogVisible: false,

            //添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },

            //添加表单的验证规则对象
            addFormRules: {
                //  验证用户名是否合法
                username: [
                     { required: true, message: '请输入用户名', trigger: 'blur' },
                     { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],

                 //验证密码是否合法
                 password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ],

                //验证邮箱是否合法
                 email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],

                //验证手机号是否合法
                 mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },

            //控制添加用户对话框显示与隐藏
            dialogVisible: false,

            //获取用户列表的参数对象
            queryInfo: {
                query: '',
                //当前的页数
                pagenum: 1,
                pagesize: 2
            },

            //所有用户列表
            userlist: [],

            //总条数
            total: 0,

            //分配角色关闭打开
            setRoleDialogVisible: false,

            //需要被分配角色的用户信息
            userInfo: {},

            //所有角色的数据列表
            rolesList: [],

            //已选中的角色Id值
            selectedRoleId: ''
        }
    },

    created(){
        this.getUserList()
    },

    methods:{
        // 删除用户
        async handleDelete(id) {
            // 弹框询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除用户信息, 是否继续?', '删除用户信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=> err     
            );

            //如果用户确认删除,则返回值为字符串confirm
            //如果用户取消了删除,则返回值为字符串cancel            
            if(confirmResult !== 'confirm') return this.$message.info('已经取消删除');
            const {data: res} = await this.$http.delete('api/users/'+id);
            if(res.meta.status !== 200) return this.$message.error('删除数据失败');
            //提示删除用户成功
            this.$message.success('删除用户成功');
            //刷新数据列表
            this.getUserList();

      },

        /**监听添加用户对话框的关闭事件 */
        handleEditClose(){
            this.$refs.editFormRef.resetFields();
        },

        /**监听修改用户确定对话框 */
         handleEidtConfirm(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return this.$message.error('请正确输入');
                //可以发起添加用户的网络请求
                const {data: res} = await this.$http.put('api/users/'+this.editForm.id,{
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                });
                if(res.meta.status !== 200) return this.$message.error('更新用户信息失败');                
                //隐藏用户对话框
                this.editDialogVisible = false;
                //重新获取用户列表数据
                this.getUserList();
                // 提示修改成功
                this.$message.success("更新用户信息成功");
            })
            
        },

        /**监听修改用户取消对话框 */
        handleEidtCancel(){
            this.editDialogVisible = false            
        },

        /**修改数据 */
        async handleEdit(id){            
            const {data: res} = await this.$http.get(`api/users/${id}`);
            //return终止出去
            if(res.meta.status !== 200) return this.$message.error('查询用户信息失败');
            this.editForm = res.data;            
            this.editDialogVisible = true;
        },

        /**监听添加用户对话框的关闭事件 */
        handleClose(){
            this.$refs.addFormRef.resetFields();
        },

        /**添加用户确定 */
        // valid接收校验结果
         handleConfirm(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return this.$message.error('请正确输入');
                //可以发起添加用户的网络请求
                const {data: res} = await this.$http.post('api/users',this.addForm);
                if(res.meta.status !== 201) return this.$message.error('添加用户失败');
                this.$message.success("添加用户成功");
                //隐藏用户对话框
                this.dialogVisible = false;
                //重新获取用户列表数据
                this.getUserList();
            })            
        },

        /**添加用户取消 */
        handleCancel(){
            this.dialogVisible = false            
        },

        /**get参数是用params进行指定 */
        async getUserList(){
         const {data: res} =  await this.$http.get('api/users',{params:this.queryInfo});
         if(res.meta.status !==200) return this.$message.error(res.meta.msg);
         this.userlist = res.data.users;
         this.total = res.data.total;
         },

         /**下拉菜单的切换 监听pagesize改变的事件 */
         handleSizeChange(newSize){           
             this.queryInfo.pagesize = newSize;
             this.getUserList();
         },

         /**页码值发生了切换 */
         handleCurrentChange(newPage){
             this.queryInfo.pagenum = newPage;
             this.getUserList();
         },

         //监听switch开关状态的改变
         /**
          * 两步
          * 第一步 监听switch开关的change事件
          * 拿到最新的状态之后立即发起ajax数据请求
          * 调用接口把状态同步到服务器中
          */
         async userStateChanged(userinfo){
             //发起这个请求会返回一个promise对象
            //  为了简化promise操作可以加一个await 和async
             const {data: res} = await this.$http.put(`api/users/${userinfo.id}/state/${userinfo.mg_state}`)
            //  return终止后续操作 内容 更新用户状态失败
             if(res.meta !== 200){
                 userinfo.mg_state = !userinfo.mg_state;
                 return this.$message.error('更新用户状态失败');
             }

            //更新状态成功
             this.$message({
                message: '更新用户状态成功',
                type: 'success'
                });
         },

         //添加用户
         handleAddUser(){
             this.dialogVisible = true;
         },

         //打开分配角色对话框
         async handleOpenRole(userInfo){
             this.userInfo = userInfo;
            //  在展示对话框之前获取所有角色的列表
            const {data: res} = await this.$http.get('api/roles')
            if(res.meta.status !== 200) return this.$message.error('获取所有角色列表失败');
            this.rolesList = res.data;
             this.setRoleDialogVisible = true;
         },

        //点击按钮分配角色
         async saveRoleInfo(){
             if(!this.selectedRoleId) return this.$message.error('请选择要分配的角色!')
             const {data :res} = await this.$http.put('api/users/'+this.userInfo.id+'/role',{rid:this.selectedRoleId})
             if(res.meta.status !== 200) return this.$message.error('更新角色失败');
             this.$message.success('更新角色成功');
             this.getUserList();
             this.setRoleDialogVisible = false;
         },

         //监听分配角色对话框的关闭事件
         setRoleAllotClosed(){
             this.selectedRoleId = '';
             this.userInfo = '';
         }

    }
}
</script>

<style lang="scss" scoped>
    .users {
        
    }
</style>