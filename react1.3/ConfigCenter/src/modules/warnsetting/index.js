module.exports = {
    path: 'warnsetting',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./home'),
            ])
        },'warnsetting')
    }
}
