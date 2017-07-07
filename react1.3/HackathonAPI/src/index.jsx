/*eslint-disable no-unused-vars */
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import 'CommonComponent/css/common.less'  //项目间公用样式
import 'common/css/common.less'  // 模块间公共样式
import 'CommonComponent/config/lib/event.js'  //事件派发器
import 'CommonComponent/prototypes/CommonPrototype' //时间格式化  format
import 'bootstrap/js/tooltip'
import 'bootstrap/js/popover'

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
    require('./modules/apimanager/router'),
    require('./modules/apiservice/router'),
    require('./modules/resourceconfig/router'),
    require('./modules/statistics/router'),
    require('./modules/usermanager/router'),
    //TODO：有其他模块，请在这里添加路由
    errorRoute
  ]
}

render(
  <Router history={browserHistory} routes={rootRoute}/>,
  document.getElementById('root')
);
