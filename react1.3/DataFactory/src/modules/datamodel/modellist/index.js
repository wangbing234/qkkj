module.exports = {
    path:"modelList",
    getComponent(localhost,callbackFunc){
        require.ensure([],(require) =>{
            callbackFunc(null,require("./component/ModelList"));
        });
    }
}