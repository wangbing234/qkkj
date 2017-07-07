/***************************************************
 * 时间: 2016/7/21 16:50
 * 作者: bing.wang
 * 说明: 数据策略
 *
 ***************************************************/
module.exports = {
	path: 'datapolicy',
	getComponent(location, cb) {
		require.ensure([], (require) => {
			console.log('datapolicy');
			cb(null, require('./components'))
		})
	}
}