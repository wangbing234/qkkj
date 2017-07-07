/*eslint-disable no-unused-vars */
import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import './common/js/event'
import Pace from  './common/js/lib/pace/pace.js'
import './common/js/lib/pace/pace.less'
Pace.start();

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
    require('./modules/main'),
    require('./modules/editor'),
    //TODO：有其他模块，请在这里添加路由
    errorRoute
  ]
}

render(
  <Router history={browserHistory} routes={rootRoute}/>,
  document.getElementById('root')
);
