export default  {
  path: 'ide',
  getComponent(location, callback) {
    require.ensure([], (require) => {
      callback(null, require('./MainPage'));
    })
  }
}
