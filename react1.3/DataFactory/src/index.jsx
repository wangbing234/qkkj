/*eslint-disable no-unused-vars */
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import './common/js/enum'
import DataTable from 'bfd-ui/lib/DataTable'
import {Select,Option} from 'bfd-ui/lib/Select'
import './common/css/layout.css'
import 'commonCss'
import './common/css/common.less'
import 'bootstrap/js/tooltip'
import 'bootstrap/js/popover'

//权限控制方法
import Auth from 'CommonComponent/utils/Auth'

import 'CommonComponent/prototypes/CommonPrototype';

//102 表示数据工厂项目的 标识
Auth.getAllAuth(102);

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
  childRoutes: [
    require('./modules/myproject'),
    require('./modules/myworkbench'),
    require('./modules/dataaudit'),
    require('./modules/datamodel'),
    require('./modules/ide'),
    require('./modules/dataaccess'),
    require('./modules/configmanage'),
    require('./modules/workflow'),
    //TODO：有其他模块，请在这里添加路由
    errorRoute
  ]
};

render(
  <Router history={browserHistory} routes={rootRoute}/>,
  document.getElementById('root')
);

