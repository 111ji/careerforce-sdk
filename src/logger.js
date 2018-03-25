var api = require("./http_client");
var utils = require("./utils");

// 数据统计
module.exports = {
  caches: [],
  _httpClient: null,

  _productName: "111ji-mp",

  setHttpClient: function(hClient) {
    this._httpClient = hClient;
  },

  setProductName: function(productName) {
    this._productName = productName;
  },

  pages: {
    stories: "故事列表",
    story: "故事详细",

    lessons: "课程列表",
    lesson: "课程详细",
    learn: "课程学习",

    my: "我的主页",
    bind: "绑定手机号",
    myLesson: "我的课程",
    protocol: "用户协议",

    wxauth: "微信授权",

    "course-teacher": "课程讲师介绍",
    "course-courseInfo": "课程详细介绍",
    "course-courseContent": "课程目录",
    "course-buyInfo": "课程购买须知",
    "course-content": "课程章节",
    "course-buy": "课程购买",

    "story-comment": "故事评论",
    "story-like": "故事喜欢",
    "course-courseContent": "课程目录",
    "course-buyInfo": "课程购买须知",

    "bind-submit": "提交绑定",
    "send-sms": "发送短信"
  },

  jsonToString: function(obj) {
    var THIS = this;
    switch (typeof obj) {
      case "string":
        return '"' + obj.replace(/(["\\])/g, "\\$1") + '"';
      case "array":
        return "[" + obj.map(THIS.jsonToString).join(",") + "]";
      case "object":
        if (obj instanceof Array) {
          var strArr = [];
          var len = obj.length;
          for (var i = 0; i < len; i++) {
            strArr.push(THIS.jsonToString(obj[i]));
          }
          return "[" + strArr.join(",") + "]";
        } else if (obj == null || obj == undefined) {
          return "null";
        } else {
          var string = [];
          for (var property in obj) string.push(THIS.jsonToString(property) + ":" + THIS.jsonToString(obj[property]));
          return "{" + string.join(",") + "}";
        }
      case "number":
        return obj;
      case false:
        return obj;
    }
  },

  // 添加日志
  log: function(type, data, objectId) {
    var content = {};
    content.type = type;
    content.product = this._productName;

    if (typeof data == "string") {
      if (this.pages[data] != null && this.pages[data] != undefined) content.data = this.pages[data];
      else content.data = data;
    } else content.data = this.jsonToString(data);

    if (objectId != undefined && objectId != null) content.objectId = objectId;
    content.referrer = document.referrer;
    content.userFrom = utils.getUrlParameter("from");
    var user = utils.getUser();
    if (user != null) {
      content.userId = user.id;
      content.userName = user.Name;
    }

    var channelCode = utils.getChannelCode();
    if (channelCode != null && channelCode != "") content.channelCode = channelCode;

    this.upload(content);
  },

  // 上传日志
  upload: function(content) {
    this._httpClient.post("https://api.careerforce.cn/111ji/u/api/logger", content).then(function() {
      if (console) console.log("log success");
    });
  }
};
