// 消息提醒
export default {
    path: 'home',
    getComponent(location, cb) {
        console.log("msgnotice-home")
        require.ensure([], (require) => {
            cb(null, require('./components'))
        }, 'msgnotice-home')
    }
}
