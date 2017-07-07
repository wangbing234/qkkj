/***************************************************
 * 时间: 2016/7/21 15:53
 * 作者: bing.wang
 * 说明: 平台审计
 *
 ***************************************************/
module.exports = {
  path: 'platform',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./PlatFormAudit'))
    })
  }
}
