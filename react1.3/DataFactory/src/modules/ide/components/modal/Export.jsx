/***************************************************
 * 时间: 7/19/16 14:46
 * 作者: zhongxia
 * 说明: 脚本导出
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import message from 'CommonComponent/component/bdosmessage'

import Model from 'IDERoot/model/ide'


const TYPE = {
  NEWEST: 'general',  //最新版本
  PUBLIC: 'publish'   //发布版本
}

class Export extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      type: TYPE.NEWEST
    };

    this.close = this.close.bind(this)
    this.okHandler = this.okHandler.bind(this)
  }

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }

    this.setState(newState);
  }

  /**
   * 关闭页面
   */
  close() {
    this.props.close && this.props.close()
    //回调清空右键导出的脚本id
    this.props.callback && this.props.callback();
  }

  /**
   * 导出按钮
   */
  okHandler() {
    //在脚本列表中导出
    if (!this.props.codes) {
      Model.exportScript(this.props.treeCode, this.state.type);
    }
    //在脚本列表中导出
    else {
      Model.exportScriptList(this.props.codes, this.state.type);
    }
    this.close()
  }

  render() {
    console.log("导出脚本文件夹ID:", this.props)
    const style = {
      radio: {marginBottom: 15, textAlign: 'center'},
      btnDiv: {textAlign: 'center'},
      btn: {marginRight: 10}
    }

    return (
      <div className="ide-export">
        <RadioGroup value={this.state.type} onChange={this.handleChange.bind(this,'type')} style={style.radio}>
          <Radio value={TYPE.PUBLIC}>发布版本</Radio>
          <Radio value={TYPE.NEWEST}>最新版本</Radio>
        </RadioGroup>
        <div style={style.btnDiv}>
          <div className="btn btn-sm btn-primary" style={style.btn} onClick={this.okHandler}>确定</div>
          <div className="btn btn-sm btn-default" onClick={this.close}>取消</div>
        </div>
      </div>
    );
  }
}

export default Export