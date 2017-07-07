// 查看权限
module.exports = {
	path: 'report',
	getComponent(location, cb) {
		require.ensure([], (require) => {
			console.log('report')
			cb(null, require('./components/ReportIndex'))
		})
	}
}