export default {
    path: 'resourcemanage',
    //子路由
    getChildRoutes(location, cb) {
        console.log("warnlog....")
        require.ensure([], (require) => {
            cb(null, [
                require('./home'),
            ])
        }, 'resourcemanage')
    }
}
