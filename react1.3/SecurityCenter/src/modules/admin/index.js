module.exports = {
    path: 'admin',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./authority'),
                require('./tenant'),
                require('./useraudit'),
                require('./usermanage')
            ])
        })
    }
}