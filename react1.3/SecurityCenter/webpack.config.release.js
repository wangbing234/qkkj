'use strict';
var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    app: './SecurityCenter/src/index',
    common: './SecurityCenter/src/common'
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].bundle.js',
    chunkFilename: 'chunk/[chunkhash:8].chunk.min.js',
    publicPath: '/pages/SecurityCenter/static/'
  },
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"',__DEV__: String(false)}),
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
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, '../CommonComponent'),
      path.resolve(__dirname, '../BFD-UI')
    ],
    alias: {
      'bfd-ui/lib': 'components',
      CommonComponent: "common/jupiter",
      CommonModalWin: "modules/owner/common/CommonModalWin",
      CommonDetailWin: "modules/owner/common/CommonDetailWin",
      commonCss: "common/jupiter/css/common.less",
      EventName: "containers/EventName.js",
      SeeUser: "modules/common/viewgrid/seeuser.js",
      SeeRole: "modules/common/viewgrid/seerole.js",
      CancalPage: "modules/common/viewpage/CancalPage",
      SeeTenant: "modules/common/viewgrid/seeTenant.js",
      AdminEnum: "modules/admin/common/enum/index.js",
      AdminUtils: 'modules/admin/common/utils/Utils.js',
      AdminHiveForm: 'modules/admin/authority/datapolicy/components/form/hiveForm',
      AdminHbaseForm: 'modules/admin/authority/datapolicy/components/form/hbaseForm',
      AdminHdfsForm: 'modules/admin/authority/datapolicy/components/form/hdfsForm',
      AdminBaseHive:'modules/admin/authority/datapolicy/components/form/children/BaseHive',
      AdminBaseHbase:'modules/admin/authority/datapolicy/components/form/children/BaseHbase',
      AdminBaseHdfs:'modules/admin/authority/datapolicy/components/form/hdfsFormContent',
      DataPolicy: 'modules/owner/authority/datapolicy/components',
      AdminAuthorityStateTranfer: 'modules/admin/common/utils/AuthorityStateTranfer',
      commonAjaxReq: 'modules/common/model/AjaxReq',
      SeeAll:'modules/common/viewgrid/SeeAll'
    }

  }
}
