export default {
  path: ':component',
  // 子路由
  getComponent(location, cb) {
    require.ensure([], require => {
      cb(null, require('./demo/' + location.pathname.split('/').pop()))
    })
  }
}