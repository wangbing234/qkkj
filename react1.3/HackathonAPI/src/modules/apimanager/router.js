export default {
  path: 'apimanager',
  // 子路由
  getChildRoutes(location, cb) {
    console.log('apimanager....')
    require.ensure([], (require) => {
      cb(null, [
        require('./mysql/router'),
        require('./hbase/router'),
      ])
    })
  }
}
