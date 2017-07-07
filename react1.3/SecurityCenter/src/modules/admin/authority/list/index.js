// 查看权限
module.exports = {
	path: 'list',
	getComponent(location, cb) {
		require.ensure([], (require) => {
			console.log('list');
			cb(null, require('./components'))
		})
	}
}