export default {
  path: 'statistics',
  // 子路由
  getChildRoutes(location, cb) {
    console.log('statistics....')
    require.ensure([], (require) => {
      cb(null, [
        require('./api/router'),
        require('./user/router'),
      ])
    })
  }
}
