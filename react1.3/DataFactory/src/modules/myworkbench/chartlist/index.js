// 查看权限
module.exports = {
	path: 'chartlist',
	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components/HomePage'))
		})
	}
};