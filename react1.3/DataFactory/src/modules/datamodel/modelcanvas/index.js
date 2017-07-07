module.exports = {
  path: "modelCanvas",
  getComponent(localhost, callbackFunc){
    require.ensure([], (require) => {
      callbackFunc(null, require("./component/ModelCanvas"));
    });
  }
}
