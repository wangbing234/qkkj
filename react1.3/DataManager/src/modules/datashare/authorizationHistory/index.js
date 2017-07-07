module.exports = {
    path: 'authorizationhistory',
    getComponent: function (location, callback) {
        require.ensure([], (require) => {
            console.log('authorizationhistory')
            callback(null, require('./components'))
        })
    }
}
