// API服务
export default {
  path: 'user',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components'))
    })
  }
}
