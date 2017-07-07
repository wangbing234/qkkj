/***************************************************
 * 时间: 8/11/16 18:25
 * 作者: zhongxia
 * 说明: 面板组件
 ***************************************************/
import React, { Component, PropTypes } from 'react';

class Pane extends Component {
  render() {
    let style = {};
    style.width = this.props.size;
    return (
      <div className={this.props.className} style={style}>{this.props.children}</div>
    );
  }
}


export default Pane;
