export default {
  path: 'resourceconfig',
  // 子路由
  getChildRoutes(location, cb) {
    console.log('resourceconfig....')
    require.ensure([], (require) => {
      cb(null, [
        require('./home/router'),
      ])
    })
  }
}
