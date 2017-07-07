// API服务
export default {
  path: 'api',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components'))
    })
  }
}
