// 权限审批
module.exports = {
    path: 'onlyread',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components'))
        },'onlyread')
    }
}
