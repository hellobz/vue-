module.exports = {
  devServer: {
    port: 3008, // 端口号
    host: "localhost",
    open: true, //配置自动启动浏览器
    proxy: {
      "/api": {
        //这里最好有一个 /
        target: "http://127.0.0.1:9999", // 后台接口域名
        ws: false, //如果要代理 websockets，配置这个参数
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          "^/api": "/api/private/v1",
        },
      },
    },
  },
};
