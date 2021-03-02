<template>
    <div class="login_container">
        <div class="login_box">
            <!--头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.jpg" alt="">
            </div>
            <!--登录表单区域-->
                <el-form label-width="0px" ref="loginRef" :rules="rules" :model="form" class="login_form">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input v-model="form.username" prefix-icon="iconfont icon-ren" @keyup.native.enter="focusNext('user')"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input v-model="form.password" ref="user" @keyup.enter.native="handleLogin" prefix-icon="iconfont icon-suo" placeholder="请输入密码" show-password> prefix-icon="iconfont icon-suo"></el-input>
                </el-form-item>
                <!--按钮-->
                <el-form-item class="btn_login">
                    <el-button type="primary" @click="handleLogin">登录</el-button>
                    <el-button type="info" @click="handleReset">重置</el-button>
                </el-form-item>
                </el-form>
            
        </div>
    </div>
</template>

<script>

    export default {
        name: 'login',
        data(){
            return{
              /**登录表单数据绑定对象 */
              form:{
                  username: '',
                  password: ''
              },

              /**验证规则 */
              rules: {
                //   验证用户名是否合法
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                //验证密码是否合法
                 password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ]
            }
        }
    },

    methods:{
        // 重置方法
        handleReset(){
            this.$refs.loginRef.resetFields();
        },
        // 登录验证
        handleLogin(){
            // this.$router.push("/home");
            this.$refs.loginRef.validate(async valid=>{
                if(!valid) return;
                const {data: res} = await this.$http.post('/api/login',this.form);     
                if(res.meta.status !== 200) return this.$message.error('不好意思,登录失败');
                this.$message({
                    message: '欢迎你,登录成功',
                    type: 'success',
                    duration: 900
                    });

                //将token保存起来
                window.sessionStorage.setItem('tomanmanken',res.data.token);
                this.$router.push('/home');
            });
        },

        //回车到下一输入框
        focusNext(nextRef){
            this.$refs[nextRef].focus();
        }
    }
    }
</script>

<!--只要定义的是单文件组件一定要给他scoped 从而防止组件之间样式冲突-->
<style lang="scss" scoped>
    .login_container {
        height: 100%;
        background-color: #2b4b6b;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        .login_box {
            width: 450px;
            height: 300px;
            background-color: #fff;
            border-radius: 10px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            .avatar_box {
                position: absolute;
                left :50%;
                transform: translate(-50%,-50%);
                width: 130px;
                height: 130px;
                border-radius: 50%;
                background-color: #fff;
                box-shadow: 0 0 10px 5px #ddd;
                padding: 10px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #ccc;
                }
            }

            .login_form {
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
                .btn_login{
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
    }
</style>