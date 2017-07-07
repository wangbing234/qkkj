export default {
    path: 'warnlog',
    //子路由
    getChildRoutes(location, cb) {
        console.log("warnlog....")
        require.ensure([], (require) => {
            cb(null, [
                require('./home'),
            ])
        }, 'warnlog')
    }
}
