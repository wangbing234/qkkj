module.exports = {
    path:'searchTable',
    getComponent(location,callbackFunc){
        require.ensure([],function(require){
            console.log('searchtable');
            callbackFunc(null,require('./component/SearchTable'));
        });
    }
};