// 查看权限
module.exports = {
	path: 'list',
	getComponent(location, cb) {
		require.ensure([], (require) => {
			cb(null, require('./components'))
		})
	}
};