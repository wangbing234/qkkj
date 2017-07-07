module.exports = {
    path:'searchScript',
    getComponent(location,callbackFunc){
        require.ensure([],(require)=>{
            callbackFunc(null,require('./component/SearchScript'));
        });
    }
};