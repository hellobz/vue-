import Vue from "vue";
import Router from "vue-router";

//导入登录组件
import Login from "@/components/Login.vue";

//导入home主页组件
import Home from "@/components/Home.vue";

//导入welcome组件
import Welcome from "@/components/Welcome.vue";

//导入用户列表组件
import Users from "@/components/user/Users.vue";

//导入权限列表组件
import Rights from "@/components/power/Rights.vue";

//导入角色管理组件
import Roles from "@/components/power/Roles.vue";

//导入商品管理组件
import Cate from "@/components/goods/Cate.vue";

//导入分类参数组件
import Params from "@/components/goods/Params.vue";

//导入订单列表组件
import Order from "@/components/order/Order.vue";

//导入数据统计组件
import Report from "@/components/report/Report.vue";

//导入商品列表组件
import Goods from "@/components/goods/Goods.vue";

//添加商品
import Add from "@/components/goods/Add.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          name: "welcome",
          component: Welcome,
        },
        {
          path: "/users",
          name: "users",
          component: Users,
        },
        {
          path: "/rights",
          name: "rights",
          component: Rights,
        },
        {
          path: "/roles",
          name: "roles",
          component: Roles,
        },
        {
          path: "/categories",
          name: "cate",
          component: Cate,
        },
        {
          path: "/params",
          name: "params",
          component: Params,
        },
        {
          path: "/orders",
          name: "order",
          component: Order,
        },
        {
          path: "/reports",
          name: "report",
          component: Report,
        },
        {
          path: "/goods",
          name: "goods",
          component: Goods,
        },
        {
          path: "/goods/add",
          name: "add",
          component: Add,
        },
      ],
    },
  ],
});

//为路由对象,添加beforeEach 导航守卫
router.beforeEach((to, from, next) => {
  //如果用户访问的登录页,直接放行
  if (to.path === "/login") return next();
  //从sessionStorage中获取保存的token值
  const tokenStr = window.sessionStorage.getItem("tomanmanken");
  //没有token,强制跳转到登录页
  if (!tokenStr) return next("/login");
  next();
});

export default router;
