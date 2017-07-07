/***************************************************
 * 时间: 16/5/11 20:45
 * 作者: zhongxia
 * 说明: Loading 加载效果
 * 使用方式:
 * import loading from './loading'
 * loading.show(true)   //显示loading效果
 * loading.show(false)  //隐藏loading效果
 *
 ***************************************************/
import React from 'react'
import { render } from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import './loading.less'

class Loading extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {}
  }

  render() {
    const { show } = this.state
    return (
      <ReactCSSTransitionGroup transitionName="in" transitionEnterTimeout={200} transitionLeaveTimeout={150}>
        {show ? (
          <div className="bdos-loading"></div>
        ) : null}
      </ReactCSSTransitionGroup>
    )
  }
}

let instance

/**
 * 把Loading 效果 添加的 body 上, 显示 loading
 * 这样只需要使用 函数的形式就可以调用 loading 效果
 * @param show
 */
function showLoading(show) {
  if (!instance) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    instance = render(<Loading/>, container)
  }
  instance.setState({
    show: show
  })
}

export default {
  show: showLoading
}