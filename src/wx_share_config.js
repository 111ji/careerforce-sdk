/**
 * Created by me on 2017/6/20.
 */
function wx_share() {
    this._httpClient = null;
    this.config = {
        wx_title: "尚技 | 懂你的生活导师",
        wx_summary: "尚技联合技能服务品牌和大师、手艺人，提供新奇、独特、新颖的技能故事、课程和服务，带给你不一样的品质生活新体验。",
        wx_title_summary: "尚技联合技能服务品牌和大师、手艺人，提供新奇、独特、新颖的技能故事、课程和服务，带给你不一样的品质生活新体验。",
        wx_link: document.location.href,
        wxid: 3,
        wx_picture: "http://www.111ji.com/static/share.jpg",
        wx_service_url: 'https://api.careerforce.cn/service/wx/wx/weixin/jsapi/signature',
        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'chooseWXPay']
    };
    this.init = function(wx, _config) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            Object.assign(_this.config, _config);
            var config = _this.config;
            var p = { "wxid": config.wxid, "urlAddress": window.location.href.split("#")[0] };
            if (/micromessenger/.test(navigator.userAgent.toLowerCase())) {
                if (typeof(wx) != "undefined" && wx != undefined && wx != null) {
                    _this._httpClient.fetch(config.wx_service_url, p)
                        .then(function(data) {
                            console.log(data)
                            wx.config({
                                debug: false,
                                appId: data.appId,
                                timestamp: data.timestamp,
                                nonceStr: data.nonceStr,
                                url: window.location.href.split("#")[0],
                                signature: data.signature,
                                jsApiList: config.jsApiList
                            });

                            wx.ready(function() {
                                wx.onMenuShareAppMessage({
                                    title: config.wx_title,
                                    desc: config.wx_summary,
                                    link: config.wx_link,
                                    imgUrl: config.wx_picture,
                                    trigger: function trigger(res) {},
                                    success: function success(res) {},
                                    cancel: function cancel(res) {},
                                    fail: function fail(res) {}
                                });
                                wx.onMenuShareTimeline({
                                    title: config.wx_title_summary,
                                    link: config.wx_link,
                                    imgUrl: config.wx_picture,
                                    trigger: function trigger(res) {},
                                    success: function success(res) {},
                                    cancel: function cancel(res) {},
                                    fail: function fail(res) {}
                                });
                                resolve();
                            });

                        }, function(err) {
                            console.log(err)
                            console.log('发生了错误')
                            reject(err);
                        });
                } else {
                    console.log('wx 对象不存在')
                    reject('wx 对象不存在');
                }
            }
        });
    }
}

//公共方法
wx_share.prototype.setHttpClient = function(hClient) {
    this._httpClient = hClient;
};

module.exports = wx_share;

