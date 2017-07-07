/***************************************************
 * 时间: 16/5/19 10:21
 * 作者: zhongxia
 * 说明: 提示信息框
 *  1. 重写了BFD-UI组件库,danger的提示框,采用遮罩的方式
 *  2. 增加关闭提示框的回调事件
 * 使用方式:
 * import message from 'CommonComponent/component/bdosmessage'
 *
 * message.success('这是一个成功的提示信息',4)   //时间单位 (秒)
 * message.danger('这是一个成功的提示信息',function(){
 *    //关闭错误提示信息的回调事件
 * })
 * message.close()  //关闭提示信息框
 *
 ***************************************************/

import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import warning from '../warning'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import classnames from 'classnames'
import './main.less'

const Message = React.createClass({

  getInitialState() {
    return {}
  },

  handleRemove() {
    this.setState({show: false})
    this.props.callback && this.props.callback() //关闭执行的回调函数
  },

  render() {
    const { show, type, message } = this.state

    return (
      <ReactCSSTransitionGroup transitionName="in" transitionEnterTimeout={200} transitionLeaveTimeout={150}>
        {show ? (
          <div>
            <div className={classnames('bfd-bdos-backdrop',type!=='danger'?'hide':'')}>
            </div>
            <div className={classnames('bfd-bdos-message', type)}>
              {message}
              <span className="glyphicon glyphicon-remove remove" onClick={this.handleRemove}></span>
            </div>
          </div>
        ) : null}
      </ReactCSSTransitionGroup>
    )
  }
})

//作用: 创建一个Message的实例, 外部使用提示信息,只需要使用调用方法的形式来调用该组件
let instance

function showMessage(type, message, duration = 2, callback) {

  if (process.env.NODE_ENV !== 'production') {
    if (typeof message !== 'string' && !(message && message['$$typeof'])) {
      warning('`message` should be `string` or `ReactElement`, check the first param of message.' + type)
    }
  }

  let _msg = document.querySelector('[data-id="__message__"]')
  _msg && _msg.parentNode.removeChild(_msg)
  const container = document.createElement('div')
  container.setAttribute('data-id', "__message__")
  document.body.appendChild(container)
  instance = render(<Message callback={callback}/>, container)

  instance.state.show || instance.setState({
    message,
    type,
    duration,
    show: true
  })
  if (duration !== 0) {
    setTimeout(() => {
      instance.setState({show: false})
    }, duration * 1000)
  }
}

export default {
  success(message, duration) {
    showMessage('success', message, duration)
  },

  danger(message, callback, duration = 0) {
    showMessage('danger', message, duration, callback)
  },

  close(){
    instance && instance.setState({show: false})
  }

}
