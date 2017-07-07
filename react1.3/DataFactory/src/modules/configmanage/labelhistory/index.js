module.exports = {
    path: 'labelHistory',
    getComponent(location, callbackFunc){
        require.ensure([], (require)=> {
            callbackFunc(null, require('./component'));
        });
    }
};