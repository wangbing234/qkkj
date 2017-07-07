import 'babel-polyfill'//es6 新特性， Object.assign问题
import 'CommonComponent/prototypes/CommonPrototype';

import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import './common/js/enum'
import 'commonCss'
import './common/css/common.less'
import 'bootstrap/js/tooltip'
import 'bootstrap/js/popover'
import 'bootstrap/js/dropdown'


window.BFD = window.BFD || {};

//权限控制方法
import Auth from 'CommonComponent/utils/Auth'
//101 标识 安全中心
Auth.getAllAuth(103);

//把用户信息保存在 window._currentUser 变量里面
Auth.getUserInfo();

//错误路由
const errorRoute = {
  path: '*',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./modules/error'))
    })
  }
}

const rootRoute = {
  path: '/',
  component: require('./containers/App'),
  indexRoute: {component: require('./modules/datafullview/fullview/FullViewPage')},
  childRoutes: [
    require('./modules/datafullview'),
    require('./modules/searchdata'),
    require('./modules/datashare'),
    //TODO：有其他模块，请在这里添加路由
    errorRoute
  ]
}

render(
  <Router history={browserHistory} routes={rootRoute}/>, document.getElementById('root')
);
