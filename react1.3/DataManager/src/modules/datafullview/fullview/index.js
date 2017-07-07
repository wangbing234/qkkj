module.exports = {
    path: 'fullview',
    getComponent(location, callback) {
        require.ensure([], function (require) {
            callback(null, require('./FullViewPage'));
        });
    }
}
