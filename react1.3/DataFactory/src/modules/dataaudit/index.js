module.exports = {
    path: 'dataaudit',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./task'),
                require('./report')
            ])
        })
    }
}