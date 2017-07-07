import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import AdminBaseHdfs from 'AdminBaseHdfs'
import AdminEnum from 'AdminEnum'
class SeeHdfsPolicy extends React.Component{
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
          <h4 className="modal-title">HDFS策略</h4>
        </ModalHeader>
        <ModalBody>
          <AdminBaseHdfs viewType={AdminEnum.SEE_UI} cancel={this.cancelHandler.bind(this)} data={this.props.data}/>
        </ModalBody>
      </Modal>

    );
  }
}
export default SeeHdfsPolicy;