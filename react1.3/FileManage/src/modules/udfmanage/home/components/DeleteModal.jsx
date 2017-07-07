/***************************************************
 * 时间: 16/6/23 17:28
 * 作者: zhongxia
 * 说明: 确定删除模态框
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import message from 'CommonComponent/component/bdosmessage'
import Model from '../model/udfManageAjax'

class DeleteModal extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      delJarPackage: false
    };
  }

  handleChange(name, event) {
    let newState = {};
    newState[name] = event.target.checked;
    this.setState(newState);
  }

  okHandler() {
    let that = this;
    //是否删除Jar包
    Model.delUdf(this.props.udfId, this.state.delJarPackage, (result)=> {
      message.success(`删除UDF函数成功!`)
      that.props.callback && that.props.callback()
    })
    that.closeWin()
  }

  closeWin() {
    this.props.closeWin && this.props.closeWin();
  }

  render() {
    return (
      <div>
        <div style={{textAlign:'center'}}>
          <h3>您确定要删除吗？</h3>
          <Checkbox checked={this.state.delJarPackage}
                    onChange={this.handleChange.bind(this,'delJarPackage')}>同时删除jar包?</Checkbox>
          <p>这将导致其它使用此包的UDF不可用</p>
        </div>
        <div style={{textAlign:'center'}}>
          <button style={{marginRight:15}}
                  className="btn btn-sm btn-primary"
                  onClick={this.okHandler.bind(this)}>确定
          </button>
          <button className="btn btn-sm btn-default"
                  onClick={this.closeWin.bind(this)}>取消
          </button>
        </div>
      </div>
    );
  }
}

export default DeleteModal