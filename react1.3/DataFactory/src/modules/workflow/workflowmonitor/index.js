module.exports = {
    path: 'workflowMonitor',
    getComponent(localhost,callbackFunc){
        require.ensure([],(require) => {
            callbackFunc(null,require("./component/MonitorIndex"));
        });
    }
};