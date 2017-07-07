var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var PORT = 3002;

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: false,
    https: false,
    historyApiFallback: true,
    stats: { colors: true }
}).listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.info("==>   Listening on port %s. Open up http://localhost:%s/ in your browser.", PORT, PORT)
});