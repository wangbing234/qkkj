/*eslint-disable no-unused-vars */
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import 'commonCss'
import 'CommonComponent/config/lib/event.js'  //事件
import './common/css/common.less'
import 'bootstrap/js/tooltip'
import 'bootstrap/js/popover'

//权限控制方法
import Auth from 'CommonComponent/utils/Auth'
//104 表示数据工厂项目的 标识
Auth.getAllAuth(105);


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
  indexRoute: {component: require('./modules/resourcemanage/home/components')},
  childRoutes: [
    require('./modules/resourcemanage'),
    require('./modules/msgnotice'),
    require('./modules/warnlog'),
    require('./modules/warnsetting'),
    //TODO：有其他模块，请在这里添加路由
    errorRoute
  ]
}

render(
  <Router history={browserHistory} routes={rootRoute}/>,
  document.getElementById('root')
);
