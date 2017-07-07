// 权限审批
module.exports = {
    path: 'edit',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./components'))
        },'edit')
    }
}
