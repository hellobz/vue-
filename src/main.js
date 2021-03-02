import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
/*导入字体图标 */
import "./assets/fonts/iconfont.css";

import TreeTable from "vue-table-with-tree-grid";

//导入富文本
import VueQuillEditor from "vue-quill-editor";

//导入样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

//导入axios
import axios from "axios";
//配置请求的根路径
// axios.defaults.baseURL = "http://127.0.0.1:9999/api/private/v1/";
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem("tomanmanken");
  return config;
});
// axios.defaults.crossDomain = true;
Vue.prototype.$http = axios;

// axios
//   .post("/api/login", { username: "admin", password: "123456" })
//   .then((res) => {
//     console.log(res);
//   });

Vue.config.productionTip = false;

Vue.filter("dateFormat", function(originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");

  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

Vue.component("tree-table", TreeTable);
// 将富文本编辑器注册全局可用的组件
Vue.use(VueQuillEditor);

/*导入全局样式表 */
import "./assets/css/global.css";

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
