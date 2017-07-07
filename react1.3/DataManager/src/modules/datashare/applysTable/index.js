module.exports = {
    path: 'applyhistory',
    getComponent: function (location, callback) {
        require.ensure([], (require) => {
            console.log('applyhistory')
            callback(null, require('./components'))
        })
    }
}
