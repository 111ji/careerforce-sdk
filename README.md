尚技 JSSDK
===============

封装PaaS服务的JavaScript组件。
主要模块有：

1. AccessToken 获取可管理；
2. Http请求工具类（自动添加AccessToken头信息）


## 安装和使用说明：

### npm安装模块：

    npm install ./sdk 


### 或浏览器引用：

    build.min.js

    // 先设置access authentication code
    // 其中占位符为 应用的appid信息，将 appid:secret base64编码
    cfsdk.sts.init({
      AUTHEN_CODE: "占位符"
    });

    // 调用服务请求
    httpClient.fetch(url, jsonObjectParams).then(function(res){
      // 处理接口调用成功
      console.log(res);
    }).catch(function(error){
      // 处理接口调用错误
      console.log(error);
    });

