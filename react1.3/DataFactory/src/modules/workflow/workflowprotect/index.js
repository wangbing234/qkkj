module.exports = {
    path:'workflowProtect',
    getComponent(localhost,callbackFunc){
        require.ensure([],(require) => {
            callbackFunc(null, require("./component/ProtectIndex"));
        });
    }
}