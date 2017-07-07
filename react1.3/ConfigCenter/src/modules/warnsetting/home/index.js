// 报警配置
export default {
    path: 'home',
    getComponent(location, cb) {
        console.log("warnsetting-home")
        require.ensure([], (require) => {
            cb(null, require('./components'))
        }, 'warnsetting-home')
    }
}
