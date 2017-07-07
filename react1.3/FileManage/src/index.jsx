/*eslint-disable no-unused-vars */
import 'babel-polyfill'
import 'CommonComponent/prototypes/CommonPrototype';
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import 'CommonComponent/css/common.less'  //项目间公用样式
import 'common/css/common.less'  // 模块间公共样式
import 'CommonComponent/config/lib/event.js'  //事件派发器
import 'bootstrap/js/tooltip'
import 'bootstrap/js/popover'

//权限控制方法
import Auth from 'CommonComponent/utils/Auth'
//104 表示数据工厂项目的 标识
Auth.getAllAuth(104);

//获取用户信息
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
  indexRoute: {component: require('./modules/filemanage/home/components')},
  childRoutes: [
    require('./modules/filemanage'),
    require('./modules/udfmanage'),
    //TODO：有其他模块，请在这里添加路由
    errorRoute
  ]
}

render(
  <Router history={browserHistory} routes={rootRoute}/>,
  document.getElementById('root')
);
