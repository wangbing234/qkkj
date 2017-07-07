/***************************************************
 * 时间: 2016/7/21 16:32
 * 作者: bing.wang
 * 说明: 权限审批
 *
 ***************************************************/
module.exports = {
    path: 'authoritysp',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            console.log('authoritysp');
            cb(null, require('./components'))
        })
    }
}
