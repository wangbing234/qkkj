module.exports = {
    path: 'myproject',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./list')
            ])
        })
    }
}