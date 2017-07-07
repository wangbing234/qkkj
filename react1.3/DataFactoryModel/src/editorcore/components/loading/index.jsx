/***************************************************
 * 时间: 16/5/4 17:29
 * 作者: zhongxia
 * 说明: [非组件库必须] Loading加载组件
 *
 ***************************************************/
import React from 'react'
import './css/loading.less'

class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let loadimg = require('./imgs/loading.gif') // 返回一个路径
    return (<div className="_loading-mask">
      <img className="_loading-img" src={loadimg} alt="loading"/>
    </div>)
  }
}


export default Loading