// API服务
export default {
  path: 'mysql',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components'))
    })
  }
}
