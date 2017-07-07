module.exports = {
    path: 'datashare',
    getChildRoutes: function (location, callback) {
        require.ensure([], (require) => {
            console.log('datashare');
            callback(null, [
                require('./applysTable'),
                require('./authorizationHistory'),
                require('./shareList'),
                require('./mysharetable')
            ])
        }
        )
    }
}