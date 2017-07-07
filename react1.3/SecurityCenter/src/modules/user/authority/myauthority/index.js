/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:我的权限
 *
 ***************************************************/
module.exports = {
    path: 'myauthority',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            console.log('myauthority');
            cb(null, require('./components'))
        })
    }
}