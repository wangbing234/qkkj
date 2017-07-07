'use strict';
var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'source-map', //如果发布的时候，必须注释掉，否则生成的文件特别大
  entry: {
    app: path.join(__dirname, 'src/index'),
    common: path.join(__dirname, 'src/common')
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].bundle.js',
    chunkFilename: 'chunk/[chunkhash:8].min.js',
    publicPath: '/magic-api/static/'
  },
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vender.js')
  ],
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
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
    extensions: ['', '.js', '.jsx'],
    root: [
      path.join(__dirname, '/src'),
      path.join(__dirname, '/'),
      path.resolve(__dirname, '../CommonComponent')
    ],
    alias: {
      CommonComponent: "common/jupiter",
      commom: 'common',
      BreadCrumb: "common/components/BreadCrumb",
      BDOSModal: "common/components/Modal/index.js",
      Loading: 'common/components/Loading/index.js',
      Util: "common/js/utils/util.js",
      Request: "common/js/utils/AjaxRequest.js",
      Model: "model/ajax.js",
      commonCss: "common/jupiter/css/common.less",
      URL: "model/url.js"
    }
  }
}
