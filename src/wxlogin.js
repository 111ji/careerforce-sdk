/**
 * Created by me on 2017/6/20.
 */
var HTTP = require("./http_client");
var http = new HTTP();

function wxlogin(config) {

    this.config = {
        current_url: window.location.href,
        wxid: 3,
        type: "mp",
        WECHAT_CALLBACK_URL: "",
        WECHAT_APP_ID: "",
        _WXURL: "https://api.careerforce.cn/service/wx/wx/user/oauth/info",
        _WX_BASE_INFO_URL: "https://api.careerforce.cn/service/wx/wx/user/oauth/base"
    };

    //@deprecated
    this.init = function(cfsdk, config) {
        var _this = this;
        Object.assign(_this.config, config);
        var code = _this.GetQueryString("code");
        if (code != null && code.toString().length > 1) {
            var openId = _this.GetQueryString("openId");
            if (openId != null) localStorage.setItem("wxUserOpenId", openId);
            return new Promise(function(resolve, reject) {
                cfsdk.httpUtil
                    .fetch("https://api.careerforce.cn/service/appkey/oauth/accessToken", {
                        grant_type: "authorization_code",
                        code: code,
                        type: _this.config.type,
                        configId: _this.config.wxid,
                        openType: "weixin",
                        redirect_uri: "123"
                    })
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        } else {
            //没有code
            var url = _this.config._WXURL;
            var redirectURI = _this.config.current_url;
            window.document.location.href = url + "?wxid=" + _this.config.wxid + "&redirectURI=" + redirectURI;
        }
    };

    this.userInfo = function(cfsdk, config) {
        var _this = this;
        Object.assign(_this.config, config);
        var code = _this.GetQueryString("code");
        if (!!code) {
            var openId = _this.GetQueryString("openId");
            if (!!openId) localStorage.setItem("wxUserOpenId", openId);
            var unionId = _this.GetQueryString("unionId");
            if (!!unionId) localStorage.setItem("wxUserUnionId", openId);
            return new Promise(function(resolve, reject) {
                cfsdk.httpUtil
                    .fetch("https://api.careerforce.cn/service/appkey/oauth/accessToken", {
                        grant_type: "authorization_code",
                        code: code,
                        type: _this.config.type,
                        configId: _this.config.wxid,
                        openType: "weixin",
                        redirect_uri: "123"
                    })
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        } else {
            var url = _this.config._WXURL;
            var redirectURI = _this.config.current_url;
            window.document.location.href = url + "?wxid=" + _this.config.wxid + "&redirectURI=" + redirectURI;
        }
    };

    this.baseInfo = function(cfsdk, config) {
        var _this = this;
        Object.assign(_this.config, config);
        var openId = _this.GetQueryString("openId");
        if (!!openId) {
            localStorage.setItem("wxUserOpenId", openId);
            var unionId = _this.GetQueryString("unionId");
            if (!!unionId) localStorage.setItem("wxUserUnionId", openId);
            return new Promise(function(resolve, reject) {
                resolve(openId, unionId);
            });
        } else {
            var url = _this.config._WX_BASE_INFO_URL;
            var redirectURI = _this.config.current_url;
            window.document.location.href = url + "?wxid=" + _this.config.wxid + "&redirectURI=" + redirectURI;
        }
    };
}

//公共方法
wxlogin.prototype = {
    GetQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
};

module.exports = wxlogin;