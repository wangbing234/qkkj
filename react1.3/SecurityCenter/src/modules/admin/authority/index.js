module.exports = {
    path: 'authority',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./authoritysp'),
                require('./datapolicy'),
                require('./list')
            ])
        })
    }
}