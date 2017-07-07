export default {
  path: 'usermanager',
  // 子路由
  getChildRoutes(location, cb) {
    console.log('usermanager....')
    require.ensure([], (require) => {
      cb(null, [
        require('./user/router'),
        require('./role/router'),
      ])
    })
  }
}
