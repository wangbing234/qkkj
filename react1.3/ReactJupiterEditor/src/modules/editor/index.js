module.exports = {
  path: 'editor',
  //子路由
  getChildRoutes(location, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./onlyread'),
        require('./edit')
      ])
    }, 'editor')
  }
}
