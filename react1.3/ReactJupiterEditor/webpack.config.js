/**
 * 该配 文件，与server  现了热部
 *   版本没有  改，不 道热部 是  以用
 */
'use strict';
var path = require('path')
var webpack = require('webpack')
var DIRNAME = __dirname.split('/')[__dirname.split('/').length - 1] // 文件夹名称


module.exports = {
  devtool: 'inline-source-map', //如果发布的时候，必须注释掉，否则生成的文件特别大
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      path.join(__dirname, 'src/index')
    ],
    common: path.join(__dirname, 'src/common')
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].bundle.js',
    chunkFilename: 'chunk/[chunkhash:8].chunk.js',
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vender.js'),
  ],
  resolve: {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['', '.js', '.jsx']
  }
}
