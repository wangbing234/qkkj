/**
 * 该配置文件，与server 实现了热部署功能
 * 发布版本没有去修改，不知道热部署是否可以用
 */
'use strict';
var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'inline-source-map', //如果发布的时候，必须注释掉，否则生成的文件特别大
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:3001',
      'webpack/hot/only-dev-server',
      path.join(__dirname, 'src/index')
    ],
    common: path.join(__dirname, 'src/common')
  },
  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].bundle.js',
    chunkFilename: 'chunk/[chunkhash:8].chunk.js',
    publicPath: '/DataManager/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      __DEV__: String(true)
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
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
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, '../CommonComponent'),
      path.resolve(__dirname, '../DataFactoryModel'),
      path.resolve(__dirname, '../DataFactory/src/modules/datamodel/modelcanvas/component/editor'),
      path.resolve(__dirname,'../BFD-UI')
    ],
    alias: {
      'bfd-ui/lib':"components",
      CommonComponent: "common/jupiter",
      commonForm: "common/components/Form/IndexView.js",
      AddRowTable: "common/components/AddRowTable.jsx",
      Editor: "src/editorcore",
      commonCss: "common/jupiter/css/common.less",
      ConfirmDelModal: "common/components/confirmdel_modal/ConfirmModal.js",
      Echarts: "common/js/component/Echarts.jsx",
      SeeTenant: 'modules/common/seeTenant',
      EventName: 'containers/EventName.js',
      CommonUtil: 'common/utils/CommonUtil',
      ENUM:'common/js/enum/index.js',
      SeeTable:'modules/datashare/common/component/SeeTable'
    }
  }
}
