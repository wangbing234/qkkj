module.exports = {
    path: 'tenant',

    getComponent(location,callbackFunc){
        require.ensure([],(require) =>{
            callbackFunc(null, require('./components/IndexView'));
    });
    }
}