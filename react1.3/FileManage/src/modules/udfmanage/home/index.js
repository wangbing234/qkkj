// 报警日志
export default {
  path: 'home',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components'))
    })
  }
}
