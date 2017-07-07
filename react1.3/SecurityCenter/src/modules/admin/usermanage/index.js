module.exports = {
    path: 'usermanage',
    //
    getComponent(location,callbackFunc){
        require.ensure([],(require) =>{
            callbackFunc(null, require('./component'));
        });
    }
}