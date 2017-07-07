/**
 * 该配置文件，与server 实现了热部署功能
 * 发布版本没有去修改，不知道热部署是否可以用
 */
'use strict';
var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'source-map', //如果发布的时候，必须注释掉，否则生成的文件特别大
  cache: true,
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3002',
      'webpack/hot/only-dev-server',
      path.join(__dirname, 'src/index')
    ],
    common: path.join(__dirname, 'src/common')
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].bundle.js',
    chunkFilename: 'chunk/[chunkhash:8].chunk.js',
    publicPath: '/HackathonAPI/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vender.js')
  ],
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'react-hot-loader!babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)(\?v=[\d\.]+)?$/,
      loader: 'file-loader?name=files/[hash:8].[ext]'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.less$/,
      loader: 'style!css!less'
    }]
  },
  resolve: {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['', '.js', '.jsx'],
    root: [
      path.join(__dirname, '/src'),
      path.join(__dirname, '/'),
      path.join(__dirname, '../CommonComponent')
    ],
    alias: {
      CommonComponent: "common/jupiter",
      commom: 'common',
      Util: "common/js/utils/util.js",
      Request: "common/js/utils/AjaxRequest.js",
      Model: "model",
      commonCss: "common/jupiter/css/common.less",
    }
  }
}
