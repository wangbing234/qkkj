/*eslint-disable no-unused-vars */
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import 'CommonComponent/css/common.less'  //项目间公用样式

////权限控制方法
//import Auth from 'CommonComponent/utils/Auth'
////102 表示数据工厂项目的 标识
//Auth.getAllAuth(102);


//错误路由
const errorRoute = {
  path: '*',
  getComponent(location, cb) {
    cb(null, require('./modules/Error'))
  }
}

const rootRoute = {
  path: '/',
  component: require('./containers/App'),
  childRoutes: [
    require('./modules'),
    errorRoute
  ]
}

//Ajax
window['__AUTHCODES__'] = ['btn1', 'btn2']

render(
  <Router history={browserHistory} routes={rootRoute}/>,
  document.getElementById('app')
);
