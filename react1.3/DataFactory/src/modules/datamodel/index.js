module.exports = {
  path: 'dataModel',
  getChildRoutes(localhost, callbackFunc){
    require.ensure([], (require) => {
      callbackFunc(null, [require('./modellist'), require('./modelcanvas')]);
    });
  }
}