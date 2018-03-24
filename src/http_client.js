var OPERATION_SUCCESS = 0;
var OPERATION_FAILD = 1;
var WRONG_RAND_NUMBER = 2;
var DATA_EXIST = 3;
var NO_AUTHENTICATION = 5;
var WRONG_USER_NAME = 6;
var WRONG_USER_PASS = 7;
var INVALID_USER = 8;
var INVALID_DATA = 9;
var USERNAME_EXIST = 10;
var USER_EMAIL_EXIST = 11;

var axios = require('axios')
    // var urllib = require('urllib');


var qs = require('qs')

var STS = require('./sts')

var http_timeout = 120000;

// axios 配置
/**
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
 */
// axios.defaults.baseURL = 'http://192.168.1.12:8080/';
// axios.defaults.baseURL = 'http://192.168.202.16:8080/';

//POST传参序列化

axios.interceptors.request.use(function(config) {
    if (config.method === 'post') {
        // console.log(config);
        /**
    console.log(config);
    var ps = {};
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    };
    if (config.data != null && config.data != "undefined") {
      var o = config.data;
      if (typeof (config.data) == 'string')
        o = qs.parse(config.data);

      for (var key in o) {
        // console.log(key + ": " + config.data[key]);
        if (key.indexOf("header_") == 0)
          headers[key.substring(7)] = o[key];
        else
          ps[key] = o[key];
      }
    }
    ps.REQUEST_TYPE = "api";
*/

        // config.headers = headers;
        // config.data = "";
        // config.params = ps;
        // console.log(qs.stringify(ps));
        // console.log(config);
    }
    return config;
}, function(error) {
    console.log(error);
    // _.toast("错误的传参", 'fail');
    return Promise.reject(error);
});

/**
//返回状态判断
axios.interceptors.response.use(function (res) {
  if (res.data.result != 0) {
    // _.toast(res.data.msg);
    return Promise.reject(res);
  }
  return res.data;
}, function (error) {
  // _.toast("网络异常", 'fail');
  return Promise.reject(error);
});
 */

function fetchAction(url, method, headers, params) {
    return new Promise(function(resolve, reject) {


        // urllib.request(url, {
        //   method: 'POST',
        //   headers: headers,
        //   data: params
        // })

        if (console) {
            // console.log(new Date().getTime());
            // console.log(url);
        }
        // console.log(headers);
        // console.log(params);

        var method = method || 'post';

        var p;
        if ("get" == method.toLowerCase())
            p = axios.get(url, params, { headers: headers, params: params, data: params, timeout: http_timeout })
        else
            p = axios.post(url, qs.stringify(params), { headers: headers, data: qs.stringify(params), timeout: http_timeout })

        p.then(function(response) {
                if (console) {
                    // console.log(new Date().getTime());
                    // console.log(response);
                }
                if (response.data.result == 0)
                    resolve(response.data.data);
                else
                    reject(response.data);
            })
            .catch(function(error) {
                if (console) {
                    // console.log(new Date().getTime());
                    // console.log(error);
                }
                reject(error)
            });
    })
}

function HttpClient() {
    this.tokenUtil = new STS();
    this.tokenUtil.setHttpClient(this);
}

HttpClient.prototype.init = function(options) {
    this.tokenUtil.init(options);
};

/**
 * http请求获取数据
 *
 * @param  {string} url    请求的URL，相对路径
 * @param  {Object} params 请求的参数
 * @return {Object}        请求返回的数据
 */
HttpClient.prototype.request = function(url, method, params) {
    params = params || {};
    params.REQUEST_TYPE = "api";
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
    // if (typeof(params.oauthToken) != "undefined")
    //     headers.oauthToken = params.oauthToken;

    var userToken = window.localStorage.getItem("user_access_token");
    try {
        if (userToken != null)
            userToken = JSON.parse(userToken);
        if (userToken && userToken.access_token)
            headers.userAccessToken = userToken.access_token;
    } catch (e) {}

    console.log(url);
    console.log(this.tokenUtil.config.AUTH_SERVER);
    if (url == this.tokenUtil.config.AUTH_SERVER) {
        // console.log("AUTHEN_CODE: " + this.tokenUtil.config.AUTHEN_CODE)
        headers.Authorization = "Basic " + this.tokenUtil.config.AUTHEN_CODE;
        // headers.Authorization = "Basic " + this.tokenUtil.config.AUTHEN_CODE;
        // params.header_Authorization = "Basic " + this.tokenUtil.config.AUTHEN_CODE;
        return fetchAction(url, method, headers, params);
    } else {

        return this.tokenUtil.getToken().then(function(t) {
            // params.header_apiAccessToken = token;
            // console.log(t);
            headers.apiAccessToken = t;
            return fetchAction(url, method, headers, params);
        }, function(err) {
            console.log(err);
            return fetchAction(url, method, headers, params);
        })
    }
};



/**
 * http请求获取数据 get
 *
 * @param  {string} url    请求的URL，相对路径
 * @param  {Object} params 请求的参数
 * @return {Object}        请求返回的数据
 */
HttpClient.prototype.get = function(url, params) {
    return this.request(url, 'get', params);
};

/**
 * http请求获取数据 post
 *
 * @param  {string} url    请求的URL，相对路径
 * @param  {Object} params 请求的参数
 * @return {Object}        请求返回的数据
 */
HttpClient.prototype.post = function(url, params) {
    return this.request(url, 'post', params);
};

/**
 * http请求获取数据 post
 *
 * @param  {string} url    请求的URL，相对路径
 * @param  {Object} params 请求的参数
 * @return {Object}        请求返回的数据
 */
HttpClient.prototype.fetch = function(url, params) {
    return this.request(url, 'post', params);
};

//
// get http request message with code
//
// @param resultCode code
// @return result message
//
/**
 * get http request message with code
 * @param  {[type]} resultCode resultCode code
 * @param  {[type]} lang       默认 zh
 * @return {[type]}            result message
 */
HttpClient.prototype.getResultMessage = function(resultCode, lang) {
    if (lang == "en") {
        switch (resultCode) {
            case OPERATION_SUCCESS:
                return "Success";
            case OPERATION_FAILD:
                return "Failed";
            case WRONG_RAND_NUMBER:
                return "Wrong verify code";
            case DATA_EXIST:
                return "Data duplicate";
            case NO_AUTHENTICATION:
                return "Authentication failed";
            case WRONG_USER_NAME:
                return "Wrong user name";
            case WRONG_USER_PASS:
                return "Wrong password";
            case INVALID_USER:
                return "invalid user";
            case INVALID_DATA:
                return "Invalid parameter[s]";
            case USERNAME_EXIST:
                return "User exist";
            case USER_EMAIL_EXIST:
                return "Email exist";
            default:
                return "System failed";
        }
    } else {
        switch (resultCode) {
            case OPERATION_SUCCESS:
                return "操作成功";
            case OPERATION_FAILD:
                return "操作失败";
            case WRONG_RAND_NUMBER:
                return "验证码错误";
            case DATA_EXIST:
                return "输入错误或记录已存在";
            case NO_AUTHENTICATION:
                return "您没有权限进行该操作";
            case WRONG_USER_NAME:
                return "错误的用户名";
            case WRONG_USER_PASS:
                return "密码错误";
            case INVALID_USER:
                return "无效的用户(未激活或已注销)";
            case INVALID_DATA:
                return "输入错误或信息无效";
            case USERNAME_EXIST:
                return "昵称已存在";
            case USER_EMAIL_EXIST:
                return "邮箱已存在";
            default:
                return "处理失败，请检查您的操作";
        }
    }
};

module.exports = HttpClient;
// module.exports = BceBaseClient;