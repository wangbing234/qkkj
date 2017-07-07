/***************************************************
 * 时间: 2016/7/20 11:06
 * 作者: lijun.feng
 * 说明: hdfs-审批->确认新增策略确认框
 ***************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
class ConfirmAddPolicy extends React.Component{
  constructor(prop){
    super(prop);
  }

  open() {
    this.refs.modal.open();
  }

  clickHandler(e){
    this.props.handleSubmit(1);
  }

  cancelHandler(){
    this.refs.modal.close();
  }

  render(){
    return (
        <div className="authoirty-sp"><Modal ref="modal">
        <ModalHeader>
          <h4 className="modal-title">提示</h4>
        </ModalHeader>
        <ModalBody>
          <div className="text-center" style={{marginBottom:15}}>
            <div>
              确定要以此申请的数据新增一条策略并授权给用户{this.props.applyerName}吗？
            </div>
            <div>注：策略内容为用户申请的内容</div>
            <div style={{marginTop:'30px'}}>
              <button type="button" className="btn btn-primary common-margin-right" onClick={this.clickHandler.bind(this)}>确认</button>
              <button type="button" className="btn btn-default" onClick={this.cancelHandler.bind(this)}>取消</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      </div>

    );
  }
}
module.exports = ConfirmAddPolicy;