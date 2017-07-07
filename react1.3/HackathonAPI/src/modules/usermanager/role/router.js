// API服务
export default {
  path: 'role',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components'))
    })
  }
}
