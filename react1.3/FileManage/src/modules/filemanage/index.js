export default {
  path: 'filemanage',
  // 子路由
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./home'),
      ])
    }, 'filemanage')
  }
}
