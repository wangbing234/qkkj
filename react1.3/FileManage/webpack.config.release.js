'use strict';
var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: {
    app: path.join(__dirname, 'src/index'),
    common: path.join(__dirname, 'src/common')
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].bundle.js',
    chunkFilename: 'chunk/[chunkhash:8].min.js',
    publicPath: '/pages/FileManage/static/'
  },
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"', __DEV__: String(false)}),
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
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['', '.js', '.jsx'],
    root: [
      path.join(__dirname, '/src'),
      path.join(__dirname, '/'),
      path.join(__dirname, '../CommonComponent'),
      path.resolve(__dirname, '../BFD-UI')
    ],
    alias: {
      'bfd-ui/lib': 'components',
      CommonComponent: "common/jupiter",
      Commom: 'common',
      BreadCrumb: "common/components/BreadCrumb",
      BDOSModal: "common/components/Modal/index.js",
      Loading: 'common/components/Loading/index.js',
    }
  }
}
