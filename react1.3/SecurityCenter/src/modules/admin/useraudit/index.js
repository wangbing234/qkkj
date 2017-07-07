module.exports = {
    path: 'useraudit',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./dataaudit'),
                require('./platformaudit')
                /*require('./loginaudit')*/
            ])
        })
    }

}