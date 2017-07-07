module.exports = {
    path: 'myworkbench',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./chartlist')
            ])
        })
    }
}