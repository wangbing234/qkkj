module.exports = {
    path: 'datafullview',
    getChildRoutes: function (location, callback) {
        require.ensure([], (require) => {
            callback(null, [
                require('./fullview')
            ])
        }
        )
    }
}