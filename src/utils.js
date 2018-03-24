var LOCAL_STORAGE_TOKEN_NAME = "user_access_token",
    COOKIE_FROM_CHANNEL = "from_channel";

module.exports = {

    utils: this,

    /**
     * 是否微信浏览器
     * @return true/false
     */
    isWx: function() {
        return (/micromessenger/.test(navigator.userAgent.toLowerCase()));
    },
    /**
     * 检查是否通过授权：微信浏览器要求授权用户信息
     * @return true/false
     */
    auth: function() {
        /**
         * 存储来源渠道参数值
         */
        var channelCode = this.getUrlParameter("channelCode");
        if (channelCode != "")
            this.setCookie(COOKIE_FROM_CHANNEL, channelCode);

        var localUserInfo = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
        if (typeof(localUserInfo) != "undefined" && localUserInfo != "undefined" && localUserInfo != null && localUserInfo != "") {
            var tokenObject = eval("(" + localUserInfo + ")");
            if (tokenObject != null && tokenObject != undefined && typeof(tokenObject.expireTime) != "undefined" && tokenObject.expireTime != null) {
                if ((tokenObject.expireTime - parseInt(new Date().getTime() / 1000)) > 20)
                    return true;
            }
        }
        return !this.isWx();
    },

    getChannelCode: function() {
        return this.getCookie(COOKIE_FROM_CHANNEL);
    },
    /**
     * 设置用户登录信息【登录成功后调用】
     * @param tokenObj 登录成功后的请求 data
     */
    setLogData: function(tokenObj) {
        // alert(JSON.stringify(tokenObj));
        tokenObj.createTime = parseInt(new Date().getTime() / 1000);
        tokenObj.expireTime = tokenObj.createTime + tokenObj.expires_in;
        window.localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, JSON.stringify(tokenObj));
    },
    /**
     * 设置用户登录信息【登录成功后调用】
     * @param tokenObj 登录成功后的请求 data
     */
    checkLoged: function() {
        var localUserInfo = window.localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
        if (typeof(localUserInfo) != "undefined" && localUserInfo != "undefined" && localUserInfo != null && localUserInfo != "") {
            var tokenObject = eval("(" + localUserInfo + ")");
            if (tokenObject != null && tokenObject != undefined && typeof(tokenObject.expireTime) != "undefined" && tokenObject.expireTime != null) {
                if ((tokenObject.expireTime - parseInt(new Date().getTime() / 1000)) > 20)
                    return true;
            }
        }
        return false;
    },
    /**
     * 缓存技能信息
     */
    cacheSkills: function(skills) {
        if (skills) {
            var obj = { "cacheTime": new Date().getTime() };
            for (var i = 0; i < skills.length; i++) {
                obj[skills[i].id] = skills[i].name;
            }
            window.localStorage.setItem("skill_names", JSON.stringify(obj));
        }
    },
    /**
     * 根据ID获取缓存技能信息名称
     * @return  名称
     */
    getSkills: function() {
        var str = window.localStorage.getItem("skill_names");
        if (str == null || str.length == 0)
            return null;
        var obj = JSON.parse(str);
        if (obj == null || obj["cacheTime"] == null || new Date().getTime() - obj["cacheTime"] > 300000)
            return null;
        return obj
    },
    /**
     * 根据ID获取缓存技能信息名称
     * @return  名称
     */
    getSkillNameById: function(id) {
        var skills = this.getSkills();
        if (skills != null)
            return skills[id];
        return null;
    },
    /**
     * 获取用户的OpenId
     * @return 如果获取到返回openId，未获取到返回空字符串
     */
    getOpenId: function() {
        var userOpenId = localStorage.getItem("wxUserOpenId");
        if (userOpenId == null || userOpenId.length == 0) {
            if (this.auth() && this.isWx()) {
                var user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)).user;
                if (user && user.openId)
                    return user.openId;
                else if (user && user.loginName)
                    return user.loginName;
            }
            return "";
        }
        return userOpenId;
    },
    /**
     * 获取用户信息
     * @return 如果未获取到返回 null
     */
    getUser: function() {
        if (this.auth()) {
            var ls = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME));
            return ls ? ls.user : null;
        }
        return null;
    },
    /**
     * 更新用户信息
     */
    setUser: function(user) {
        localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME, JSON.stringify(user));
    },
    /**
     * 获取用户名称
     * @return 如果未获取到返回系统生成的游客用户名
     */
    getUserName: function() {
        if (this.auth() && this.isWx())
            return JSON.parse(localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)).user.name;
        return "游客用户" + new Date().getTime();
    },
    /**
     * 获取网页参数
     * @param 参数名称
     * @return 如果获取到，返回参数值。默认返回 null
     */
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    /**
     * 获取网页URL参数
     * @param 参数名称
     * @return 如果获取到，返回参数值。默认返回 ""(空字符串)
     */
    getUrlParameter: function(name) {
        var r = window.location.pathname;
        if (r.indexOf("/" + name + "/") > -1) {
            r = r.substring(r.indexOf("/" + name + "/") + name.length + 2);
            if (r.indexOf("/") > -1)
                r = r.substring(0, r.indexOf("/"));
            if (r.indexOf(".") > -1)
                r = r.substring(0, r.indexOf("."));
            return r;
        }
        return "";
    },
    /*
     * 格式化评论
     * **/
    filterComment: function(res) {
        var Arr = [];
        for (var j in res) {
            var tmpArr = {};
            for (var k in res[j]) {
                if (res[j][k].id == res[j][k].followId) {
                    tmpArr['root'] = res[j][k];
                }
                var str = res[j][k].id;
                tmpArr[str] = res[j][k];
            }
            for (var l in tmpArr) {
                if (l != 'root' && tmpArr[l].refererId != 0) {
                    var one = tmpArr[l].refererId;
                    tmpArr[l]["replyTo"] = tmpArr[l]['userName'] + ' 回复 ' + tmpArr[one]['userName']
                }
            }
            Arr.push(tmpArr);
        }
        return Arr
    },
    /*
      参数 postdate: 豪秒
      返回 30分钟以内返回 几秒前 几分钟前，其他显示时间 
    */
    parseTime: function(postdate) {
        var second = 1000;
        var minutes = second * 60;
        var hours = minutes * 60;
        var days = hours * 24;
        var months = days * 30;
        var twomonths = days * 365;
        var myDate = new Date(postdate);
        if (isNaN(myDate)) {
            myDate = new Date(postdate.replace(/-/g, "/"));
        }
        var nowtime = new Date();
        var longtime = nowtime.getTime() - myDate.getTime();
        var showtime = 0;
        if (longtime > days) {
            return this.parseTimeToDate(postdate, 'yyyy-MM-dd hh:mm:ss');
        } else if (longtime > days) {
            return (Math.floor(longtime / days) + "天前");
        } else if (longtime > hours) {
            return (Math.floor(longtime / hours) + "小时前");
        } else if (longtime > minutes) {
            return (Math.floor(longtime / minutes) + "分钟前");
        } else if (longtime > second) {
            return (Math.floor(longtime / second) + "秒前");
        } else if (longtime >= 0) {
            return ("1秒前");
        } else {
            return (longtime + " error ");
        }
    },
    /*
    参数 postdate: 豪秒
    返回 2012-10-30 
    模板 yyyyMMdd
    */
    parseTimeToDate: function(postdate, tmeplet) {
        var d = new Date(postdate);
        //转化为 日+小时+分+秒
        var o = {
            "M+": d.getMonth() + 1, //month 
            "d+": d.getDate(), //day 
            "h+": d.getHours(), //hour 
            "m+": d.getMinutes(), //minute 
            "s+": d.getSeconds(), //second 
            "q+": Math.floor((d.getMonth() + 3) / 3), //quarter 
            "S": d.getMilliseconds() //millisecond 
        }
        if (/(y+)/.test(tmeplet)) {
            tmeplet = tmeplet.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(tmeplet)) {
                tmeplet = tmeplet.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return tmeplet;
    },
    /*格式化时间戳*/
    getDate: function(timeStamp) {
        function add0(m) { return m < 10 ? '0' + m : m };
        //timeStamp 是整数，否则要parseInt转换
        var time = new Date(timeStamp * 1000);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        // return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
        return y + '-' + add0(m) + '-' + add0(d);
    },
    setTitle: function(t) {
        document.title = t;
        var i = document.createElement('iframe');
        i.src = '//m.baidu.com/favicon.ico';
        i.style.display = 'none';
        i.onload = function() {
            setTimeout(function() {
                i.remove();
            }, 9)
        }
        document.body.appendChild(i);
    },

    setCookie: function(name, value) {
        var argv = setCookie.arguments;
        var argc = setCookie.arguments.length;
        var expires = (argc > 2) ? argv[2] : null;
        if (expires != null) {
            var LargeExpDate = new Date();
            LargeExpDate.setTime(LargeExpDate.getTime() + (expires * 1000 * 3600 * 24));
        }
        document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + LargeExpDate.toGMTString())) + "; path=" + "/";
    },
    getCookie: function(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return '';
    },
    delCookie: function(name) {
        var expdate = new Date();
        expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
        setCookie(name, "", expdate);
    },


    getNotNullString: function(val) {
        if (typeof(val) == "undefined" || val == null)
            return "";
        return val;
    }
}