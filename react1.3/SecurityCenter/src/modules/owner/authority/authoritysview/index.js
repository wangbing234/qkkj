/***************************************************
 * 时间: 2016/7/21 15:45
 * 作者: bing.wang
 * 说明: 查看权限路由
 *
 ***************************************************/
module.exports = {
	path: 'list',
	getComponent(location, cb) {
		require.ensure([], (require) => {
			console.log('list')
			cb(null, require('./components'))
		})
	}
}