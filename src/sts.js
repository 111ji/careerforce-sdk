//
// token utils
//
// - get stored token
// - update token before expired automaticly
//
// var httpClient = new HttpClient();

function STS(options) {
    this.config = {
        AUTH_SERVER: "https://api.careerforce.cn/service/appkey/oauth/accessToken",
        AUTHEN_CODE: "MTIzNTgzMTYwOjIwMTU0OGZhMDA2ZWE4MjNhNTljNjAxYjg3ZmRlYjY1",
        TOKEN_STORAGE_NAME: "ACCESS_TOKEN"
    };

    if ("undefined" != typeof(options) && options != null)
        for (var property in options) this.config[property] = options[property];

    this._httpClient = null;
}

STS.prototype.setHttpClient = function(hClient) {
    this._httpClient = hClient;
};

STS.prototype.init = function(options) {
    // console.log(this.config);
    // console.log(options);
    if ("undefined" != typeof(options) && options != null)
        for (var property in options) this.config[property] = options[property];
};

STS.prototype.expire = function() {
    window.localStorage.removeItem(this.config.TOKEN_STORAGE_NAME);
};


/**
 * loadToken: 从服务端获取新的Token
 */
STS.prototype.loadToken = function() {
    var _this = this;
    return new Promise(function(resolve, reject) {
        // console.log("loading token action...");
        // console.log(_this._httpClient);
        // this._httpClient = new HttpClient();
        // if (this._httpClient == null)
        //   this._httpClient = httpClient;

        _this._httpClient.fetch(_this.config.AUTH_SERVER, {
                // HttpClient.fetch(this.config.AUTH_SERVER, {
                grant_type: 'client_credentials'
            })
            .then(function(res) {
                // console.log(res);
                window.localStorage.setItem(_this.config.TOKEN_STORAGE_NAME,
                    JSON.stringify({
                        token: res.access_token,
                        expireTime: parseInt((new Date()).getTime() / 1000) + res.expires_in
                    })
                );

                resolve(res.access_token);
            }).catch(function(error) {
                reject(error)
                console.log(error)
            });
    });
};

/**
 * get token
 * @return token string
 */
STS.prototype.getToken = function() {
    // console.log("getting token...");

    var _this = this;

    return new Promise(function(resolve, reject) {

        var tokenObject = window.localStorage.getItem(_this.config.TOKEN_STORAGE_NAME);
        // console.log(tokenObject);
        if (tokenObject && tokenObject != null && tokenObject != "") {
            var userToken = JSON.parse(tokenObject);
            if (userToken != null) {
                // 判断是否过期
                var expireTime = userToken.expireTime;
                var nowTime = parseInt((new Date()).getTime() / 1000);
                // console.log(expireTime + "getting token..." + nowTime);
                // 如果过期时间小于20s，获取新的 token 并返回
                if (expireTime - nowTime > 20) {
                    resolve(userToken.token);
                    return;
                }
            }
        }

        _this.loadToken().then(function(token) {
            resolve(token);
        }).catch(function(error) {
            reject(error);
        })

    });
};

module.exports = STS;