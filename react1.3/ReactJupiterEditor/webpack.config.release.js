'use strict';
var path = require('path')
var webpack = require('webpack')
var DIRNAME = __dirname.split('/')[__dirname.split('/').length - 1] // 文件夹名称

module.exports = {
  entry: {
    app: path.join(__dirname, 'src/index'),
    common: path.join(__dirname, 'src/common')
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].bundle.js',
    chunkFilename: 'chunk/[chunkhash:8].chunk.min.js',
    publicPath: '/' + DIRNAME + '/static/',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'react-hot-loader!babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(gif|jpe?g|png|woff|svg|eot|ttf)\??.*$/,
      loader: 'url-loader?limit=50000&name=[name].[hash:8].[ext]'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vender.js'),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: [
      path.join(__dirname, '/')
    ],
    alias: {}
  }
}
