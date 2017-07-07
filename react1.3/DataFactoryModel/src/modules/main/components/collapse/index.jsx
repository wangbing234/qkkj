/***************************************************
 * 时间: 16/5/4 17:29
 * 作者: zhongxia
 * 说明: collapse 组件
 * 使用说明:
 <Collapse title="title">
 随便内容
 </Collapse>
 *
 ***************************************************/

import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import './css/index.less'

class Collapse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: this.props.visible || false
    }
  }

  componentDidMount() {
    this.setStyle(this.state.visible);
  }

  /**
   * 点击事件
   * @param e
   */
  clickHandler(e) {
    let flag = this.state.visible;
    flag = !flag;
    this.setStyle(flag);
    this.props.callback && this.props.callback(flag);
    this.setState({visible: flag})
  }

  /**
   * 设置三角形的方向
   * @param e
   * @param flag
   */
  setStyle(flag) {
    let tar = ReactDOM.findDOMNode(this.refs.collapse);
    let arrow = tar.getElementsByClassName('arrow')[0];
    if (flag) {
      arrow.style.transform = "rotate(360deg)"
    }
    else {
      arrow.style.transform = "rotate(270deg)"
    }
  }

  render() {
    return (
      <div {...this.props}>
        <span className="bfd-collapse" ref="collapse"
              onClick={this.clickHandler.bind(this)}>
          <span className="arrow"></span>
          <span>{this.props.title}</span>
        </span>
        <ReactCSSTransitionGroup transitionName="in" transitionEnterTimeout={200} transitionLeaveTimeout={150}>
          <div style={{display:this.state.visible?'block':'none'}}>
            {this.props.children}
          </div>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

Collapse.propTypes = {
  title: React.PropTypes.string.isRequired,
}
Collapse.defaultProps = {
  title: '标题'
}

export default Collapse