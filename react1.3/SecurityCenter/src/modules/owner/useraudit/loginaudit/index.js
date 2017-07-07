/***************************************************
 * 时间: 2016/7/21 15:53
 * 作者: bing.wang
 * 说明: 登陆审计
 *
 ***************************************************/
module.exports = {
  path: 'login',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./LoginAudit'))
    })
  }
}
