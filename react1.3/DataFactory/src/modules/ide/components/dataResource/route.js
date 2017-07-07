export default {
  path: 'dataResource',
  //子路由
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./index'));
    })
  }
}
