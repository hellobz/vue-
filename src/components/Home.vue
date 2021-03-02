<template>
        <el-container class="home">
             <!--头部区域-->
            <el-header>
                <div>
                    <!-- <span style='font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;'>后台管理系统</span> -->
                    <span>后台管理系统</span>
                </div>
                 <el-button type="primary" @click="handleOut">退出</el-button>
            </el-header>
            <!--页面主体区域-->
        <el-container>
            <!--侧边栏区域-->
            <el-aside :width="toggleBool?'64px':'200px'">
                <div class="toggle-button" @click="handleToggle">|||</div>
                <!-- 侧边栏菜单区域 -->                
                 <el-menu 
                :default-active="activePath" 
                router
                :collapse-transition="false"
                :collapse="toggleBool"  
                :unique-opened="true"          
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409EFF">
                <!-- 一级菜单 -->
                <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                    <!-- 一级菜单模板区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                    <i :class="'iconfont '+iconsObj[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.authName}}</span>
                    </template> 
                    <!--二级菜单-->
                    <el-menu-item v-for="subItem in item.children" :key="subItem.id" @click="saveNavClick('/'+subItem.path)" :index="'/'+subItem.path">
                        <!-- 二级菜单模板区域 -->
                         <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{subItem.authName}}</span>
                        </template> 
                    </el-menu-item>
                </el-submenu>                
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <!--路由占位符-->
                <router-view/>
            </el-main>
        </el-container>
        </el-container>
</template>

<script>
    export default {
        name: 'home',
        data(){
            return{
                //激活链接
                activePath: '',
                //是否折叠展开
                toggleBool: false,
                //左侧菜单数据
                menulist:[],
                // 图标
                iconsObj: {
                    '125': 'icon-user',
                    '103': 'icon-tijikongjian',
                    '101': 'icon-shangpin',
                    '102': 'icon-danju',
                    '145': 'icon-baobiao'
                }
            }
        },
        created(){
            this.getMenuList() 
            this.activePath = window.sessionStorage.getItem('activePath') || '/users'
        },
        methods:{
            //保存链接的激活状态
            saveNavClick(activePath){
                window.sessionStorage.setItem('activePath',activePath);
                this.activePath = activePath;
            },

            //退出登录
            handleOut(){
                window.sessionStorage.clear();
                this.$router.push('/login');
            },

            //获取所有的菜单
            async getMenuList(){
                const {data:res} = await this.$http.get('/api/menus');
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                // console.log(res);
                this.menulist = res.data;
            },

            //点击按钮切换菜单的折叠与展开
            handleToggle(){
                this.toggleBool = !this.toggleBool;
            }
        }
    }

</script>

<style lang="scss" scoped>
    .home {
        height: 100%;
        .el-header {
            background-color: #373d41;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            font-size: 20px;
            >div{
                display: flex;
                align-items: center;
                span {
                    cursor: pointer;
                }
            }
        }

        

        .el-aside {
            background-color: #333744;
            height: 100%;
            .toggle-button {
                line-height: 24px;
                text-align: center;
                font-size: 10px;
                letter-spacing: 0.2em;
                cursor: pointer;
                user-select: none;
                color: #fff;
                background-color: #4A5064;
            }
            .el-menu {
                border-right: none;
                .iconfont {
                    margin-right: 10px;
                }
            }
        }

        .el-main {
            background-color: #eaedf1;
        }
    }
</style>