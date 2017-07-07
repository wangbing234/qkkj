module.exports = {
    path: 'mysharetable',
    getComponent(location, callback) {
        require.ensure([], function (require) {
            console.log('mysharetable');
            callback(null, require('./components'));
        });
    }
}
