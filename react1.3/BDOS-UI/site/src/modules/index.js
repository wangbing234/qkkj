export default {
  path: 'components',
  // 子路由
  getComponent(location, cb) {
    cb(null, require('./components/Components'))
  },
  getChildRoutes(location, cb) {
    console.log(location, cb)
    require.ensure([], (require) => {
      cb(null, [
        require('./components')
      ])
    })
  }
}