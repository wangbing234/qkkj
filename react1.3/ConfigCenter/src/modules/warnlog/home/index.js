// 报警日志
export default {
    path: 'home',
    getComponent(location, cb) {
        console.log("warnlog-home")
        require.ensure([], (require) => {
            cb(null, require('./components'))
        }, 'warnlog-home')
    }
}
