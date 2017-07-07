module.exports = {
    path: "datainput",

    //子路由
    getComponent(location, callbackFunc){
        require.ensure([], function (require) {
            callbackFunc(null, require('./component'));
        })
    }
}
