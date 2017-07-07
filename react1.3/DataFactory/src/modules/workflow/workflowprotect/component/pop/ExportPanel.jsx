/****************************************************
 * create by qing.feng
 * time 2016/7/21 20:38
 * desc：工作流维护- 导出界面
 *****************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import FormFooter from 'CommonComponent/component/formfooter'
import Util from 'CommonComponent/utils/CommonUtil'
import message from 'CommonComponent/component/bdosmessage'
import AjaxReq from '../ajax/AjaxReq'

class ExportPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { type: "0"};
  }

  /*弹出当前界面*/
  open() {
    this.refs.modal.open();
  }

  /*导出处理*/
  saveHandle() {
    if(this.state.isAll){
      this.exportReq(true);
    }else if(this.props.selectItems && this.props.selectItems.length > 0){
      this.exportReq(false);
    }else {
      message.danger("请选择需要导出的工作流");
    }
  }

  exportReq(isAll){
    var newWindow = window.open('about:blank')
    let url = `${Server.workflow}batchfileDownload`
    let param = {
      projectId: window.projectId,
      isAll: isAll ? "1" : "0",
      isRelease: this.state.type
    };
    if(!isAll){
      param.processKeys = this.props.selectItems.join(",");
    }
    url += '?' + Util.objectToURL(param)
    newWindow.location.href = url;
  }

  /*取消点击处理，关闭当前弹出框*/
  cancelHandle() {
    this.refs.modal.close();
  }

  /*checkbox 复选框change处理*/
  checkChange() {
    let isAll = !this.state.isAll;
    this.setState( { isAll: isAll } );
  }

  /*单选按钮change处理*/
  typeChange( value ) {
    this.setState( { ...this.state, type: value } );
  }

  render() {
    return (
      <Modal ref="modal">
        <ModalHeader>
          <h4 className="modal-title">导出</h4>
        </ModalHeader>
        <ModalBody>
          <div className="workflow-export-div" style={{marginLeft:"100px",marginBottom:"20px"}}>
            <Checkbox checked={this.state.isAll} onChange={this.checkChange.bind(this)}>是否全部导出</Checkbox>
            <RadioGroup value={this.state.type} onChange={this.typeChange.bind(this)}>
              <Radio value="1">发布版本</Radio>
              <Radio value="0">最新版本</Radio>
            </RadioGroup>
          </div>

          <FormFooter
            style={{marginLeft:"100px"}} submitClick={this.saveHandle.bind(this)}
            submitLabel="导出" cancelClick={this.cancelHandle.bind(this)}></FormFooter>
        </ModalBody>
      </Modal>
    );
  }
}
export default ExportPanel