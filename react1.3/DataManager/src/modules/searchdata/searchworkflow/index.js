module.exports = {
    path:'searchWorkflow',
    getComponent(location,callbackFunc){
        require.ensure([],(require) => {
            callbackFunc(null,require('./component/Index'));
        });
    }
};