// 资源管理
export default {
    path: 'home',
    getComponent(location, cb) {
        console.log("resourcemanage-home")
        require.ensure([], (require) => {
            cb(null, require('./components'))
        }, 'resourcemanage-home')
    }
}
