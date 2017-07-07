/***************************************************
 * 时间: 16/6/14 11:23
 * 作者: zhongxia
 * 说明: 查看脚本组件,内部使用 IDE, 从外部传入脚本id,获取脚本信息
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import IDE  from 'CommonComponent/component/ide'

//Ajax 操作
import Model from '../../model/versionHistory'

class SeeScript extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  componentDidMount() {
    const that = this;
    Model.getScriptInfo(this.props.scriptId, function (result) {
      that.setState({scriptInfo: result.data})
    })
  }

  render() {
    //设置脚本的类型,根据查看传过来的参数
    let mode = this.props.mode || 'javascript'

    return (
      <Modal ref="modal">
        <ModalHeader>
          <h4 className="modal-title">查看脚本</h4>
        </ModalHeader>
        <IDE readOnly={true} mode={mode}>
          {this.state.scriptInfo}
        </IDE>
      </Modal>
    );
  }
}

export default SeeScript