// 查看权限
module.exports = {
	path: 'task',
	getComponent(location, cb) {
		require.ensure([], (require) => {
			console.log('task')
			cb(null, require('./components/TaskIndex'))
		})
	}
}