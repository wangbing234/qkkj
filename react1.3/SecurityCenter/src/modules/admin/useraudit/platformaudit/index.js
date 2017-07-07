module.exports = {
  path: 'platform',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/PlatformAudit'))
    })
  }
}
