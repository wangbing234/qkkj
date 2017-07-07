/***************************************************
 * 时间: 2016/7/20 11:06
 * 作者: lijun.feng
 * 说明: hdfs审批表单-->添加到已有策略-->编辑策略基本信息
 ***************************************************/
import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import HdfsForm from '../../../datapolicy/components/form/hdfsForm'
class EditHdfsPolicy extends React.Component{
  constructor(prop){
    super(prop);
  }

  open() {
    this.refs.modal.open();
  }

  clickHandler(){
    //this.props.yesHandler();
    //确认操作 调用后台
    this.refs.modal.close();
  }

  cancelHandler(){
    //调用关闭方法
    this.refs.modal.close();
  }

  render(){
    return (<Modal ref="modal">
        <ModalHeader>
          <h4 className="modal-title">策略基本信息</h4>
        </ModalHeader>
        <ModalBody>
          <HdfsForm cancel={this.cancelHandler.bind(this)}/>
        </ModalBody>
      </Modal>

    );
  }
}
export default EditHdfsPolicy;