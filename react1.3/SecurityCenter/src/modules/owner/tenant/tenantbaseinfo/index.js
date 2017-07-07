/***************************************************
 * 时间: 2016/7/21 15:51
 * 作者: bing.wang
 * 说明: 租户基本信息路由
 *
 ***************************************************/
module.exports = {
  path: 'tenantbaseinfo',
  getComponent(location, cb) {
  	console.log("tenantbaseinfo");
    require.ensure([], (require) => {
      cb(null, require('./components/Index'))
    })
  }
}
