// 数据策略
module.exports = {
	path: 'datapolicy',
	getComponent(location, cb) {
		require.ensure([], (require) => {
			console.log('datapolicy')
			cb(null, require('./components/IndexView'))
		})
	}
}