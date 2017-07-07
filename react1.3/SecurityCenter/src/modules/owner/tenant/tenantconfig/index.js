/***************************************************
 * 时间: 2016/7/21 15:51
 * 作者: bing.wang
 * 说明: 租户配置主页面
 *
 ***************************************************/
module.exports = {
  path: 'tenantconfig',
  getComponent(location, cb) {
  	 console.log("tenantconfig");
    require.ensure([], (require) => {
      cb(null, require('./components/Index'))
    })
  }
}
