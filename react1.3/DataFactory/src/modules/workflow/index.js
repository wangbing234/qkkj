module.exports = {
    path:'workflow',
    getChildRoutes(localhost,callbackFunc){
        require.ensure([],(require)=>{
            callbackFunc(null,[require('./workflowprotect'),require('./workflowmonitor')]);
        });
    }
};