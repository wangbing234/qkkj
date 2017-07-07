export default {
  path: 'apiservice',
  // 子路由
  getChildRoutes(location, cb) {
    console.log('apiservice....')
    require.ensure([], (require) => {
      cb(null, [
        require('./home/router'),
      ])
    })
  }
}
