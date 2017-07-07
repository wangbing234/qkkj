module.exports = {
    path: 'msgnotice',
    //子路由
    getChildRoutes(location, cb) {
        console.log("msgnotice")
        require.ensure([], (require) => {
            cb(null, [
                require('./home'),
            ])
        },'msgnotice')
    }
}
