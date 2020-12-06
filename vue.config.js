// vue-cli配置，90%都是webpack的配置

module.exports = {
    configureWebpack: {
      resolve: {
        alias: {
            // 配置文件别名
          'assets': '@/assets',
          'common': '@/common',
          'components': '@/components',
          'network': '@/network',
          'views': '@/views',
        }
      }
    },
    // devServer:{
    //   proxy:{
    //     // 配置代理
    //     "/api":{
    //       // 凡是以 /x 开头的请求，进行代理
    //       target:"http://127.0.0.1:8888/api/private/v1/",
    //       changeOrigin: true,
    //       ws: true,
    //       pathRewrite: {
    //         '^/api': '/api' 
    //       }
    //     }
    //   }
    // }
  }
  