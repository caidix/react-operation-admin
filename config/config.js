const path = require('path');
const config = {
  defineConstants: {},
  // alias: {
  //   "@": path.resolve(__dirname, "../src"),
  // },
  staticDirectory: "static",
  devServer: {
    proxy: [
      {
        target: "http://127.0.0.1:7001", // target host
        changeOrigin: true, // needed for virtual hosted sites
        // pathRewrite: {
        //   "^//api": "/",
        // },
        context: "/admin/api",
        cookieDomainRewrite: "",
      },
    ],
    host: "localhost",
    port: "9528",
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    open: false,
  },
  lessLoaderOptions: {
    lessOptions: {
      modifyVars: {
        "primary-color": "#2F54EB",
        "btn-border-radius-base": "4px",
        "@ant-prefix": "mp-antd",
      },
      javascriptEnabled: true,
    },
  },
  resourcesLoaderOptions: {
    lessConfig: {
      patterns: [ // 加载less全局变量
        path.resolve(__dirname, '../src/style/var.less'),
      ]
    }
  }
};

module.exports = function () {
  if (process.env.NODE_ENV === "development") {
    return Object.assign({}, config, require("./dev.config.js"));
  }
  return Object.assign({}, config, require("./prod.config.js"));
};
