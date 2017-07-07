module.exports = {
    path: "dataoutput",

    getComponent(location, callbackFunc){
        require.ensure([],function (require){
            callbackFunc(null,require('./component'));
        })
    }
}
