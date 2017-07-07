module.exports = {
    path: 'sharelist',
    getComponent(location, callback) {
        require.ensure([], function (require) {
            console.log('sharelist');
            callback(null, require('./components'));
        });
    }
}
