/*eslint-disable no-unused-vars */
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import './common/js/enum'
import 'commonCss'
//import './common/css/layout.css'
import './common/css/common.less'
import 'bootstrap/js/tooltip'
import 'bootstrap/js/popover'
import 'bootstrap/js/dropdown'
import 'CommonComponent/prototypes/CommonPrototype';

//权限控制方法
import Auth from 'CommonComponent/utils/Auth'

//101 标识 安全中心
Auth.getAllAuth(101);

//把用户信息保存在 window._currentUser 变量里面
Auth.getUserInfo();
//window._currentUser.isTenantOwner=1;
//window._currentUser.userType=1;
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
  //indexRoute: {component: require('./modules/admin/usermanage/component')},
  childRoutes: [
    /*require('./modules/usermanage'),
     require('./modules/tenant'),
     require('./modules/authority'),
     require('./modules/useraudit'),*/
    require('./modules/admin'),
    require('./modules/owner'),
    require('./modules/user'),
    //TODO：有其他模块，请在这里添加路由
    errorRoute
  ]
}

render(
  <Router history={browserHistory} routes={rootRoute}/>,
  document.getElementById('root')
);
