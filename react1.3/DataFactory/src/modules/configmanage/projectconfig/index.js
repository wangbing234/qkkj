module.exports = {
    path: "projectconfig",

    getComponent(location, callbackFunc){
        require.ensure([], function (require) {
            callbackFunc(null, require('./components'));
        })
    }
}
