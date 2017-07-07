// 权限审批
module.exports = {
    path: 'authoritysp',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            console.log('authoritysp')
            cb(null, require('./components/AuthoritySpMain'))
        })
    }
}
