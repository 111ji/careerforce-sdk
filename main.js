var HttpUtil = require("./src/http_client.js");
var STS = require("./src/sts.js");
var WXLOGIN = require("./src/wxlogin");
var wx_share = require("./src/wx_share_config");
var logger = require("./src/logger");
var utils = require("./src/utils");

var httpUtil = new HttpUtil();
var sts = new STS();
var wx_share = new wx_share();

sts.setHttpClient(httpUtil);
logger.setHttpClient(httpUtil);
wx_share.setHttpClient(httpUtil);

exports.utils = utils;
exports.httpUtil = httpUtil;
exports.sts = sts;
exports.WXLOGIN = WXLOGIN;
exports.wx_share = wx_share;
exports.logger = logger;