/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:申请路由
 *
 ***************************************************/
module.exports={
    path:'myapply',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components'))
        })
    }
}