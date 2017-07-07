import React, { PropTypes } from 'react'
import classNames from 'classnames'
import Input from 'Base/Input'
import SplitPane from 'Base/SplitPane'

class SplitPaneDEMO extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = {};
    //针对 多选框, 文本框
    if (event && event.target) {
      switch (event.target.type) {
        case "number":
          newState[name] = parseInt(event.target.value) || 0;
          break;
        case "checkbox":
          newState[name] = event.target.checked;
          break;
        default:
          newState[name] = event.target.value;
      }
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  render() {
    return (
      <SplitPane split="horizontal" defaultSize={300} minSize={100}>
        <div style={{background:'aquamarine'}}>
          <Input type="text" restrict={/^\d+$/} onChange={this.handleChange.bind(this,'name')}/>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
          <h2>zhongxhoasdfkjasl;dfjk</h2>
        </div>
        <div style={{background:'antiquewhite'}}>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
          <h1>zhongxiazhongxia</h1>
        </div>
      </SplitPane>
    );
  }
}

export default SplitPaneDEMO