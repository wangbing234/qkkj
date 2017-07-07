/***************************************************
 * 时间: 2016/7/21 15:55
 * 作者: bing.wang
 * 说明: 用户管理
 *
 ***************************************************/
module.exports = {
    path: "usermanage",

    //子路由
    getChildRoutes(location, callbackFunc){
        require.ensure([], function (require) {
            callbackFunc(null, [require("./user"), require("./role")]);
        })
    }
}
