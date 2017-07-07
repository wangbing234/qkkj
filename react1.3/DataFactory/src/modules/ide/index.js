module.exports = {
  path: 'ide',
  getChildRoutes(localhost, callback){
    require.ensure([], (require) => {
      callback(null, [
        //require('./components/versionHistory/route'),
        //require('./components/dataResource/route'),
        require('./components/route'),
      ]);
    });
  }
}
