module.exports = {
    path: 'admin',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./datafullview'),
                require('./dataShare'),
                require('./searchData')
            ])
        })
    }
}