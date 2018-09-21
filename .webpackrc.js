const path = require('path');


const { resolve } = require("path");

const proxyTarget = "http://127.0.0.1:9090";


module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), 
    },
  },
  entry: {
    index: ["src/index.js"],
  },
  output: {
    path: resolve("build"),
    filename: "[name].[hash].js"
  },   
  devServer: {
    proxy: {
      "/**": {
        target: proxyTarget,
        changeOrigin: true,
        bypass: function(req, res, proxyOpt) {
          // 添加 HTTP Header 标识 proxy 开启
          res.set("X-ICE-PROXY", "on");
          res.set("X-ICE-PROXY-BY", proxyTarget);
        }
      }
    }
  }
};