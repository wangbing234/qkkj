import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'

import FormFooter from 'CommonComponent/component/formfooter'
import message from 'CommonComponent/component/bdosmessage'

import AjaxReq from '../../ajax/AjaxReq'

class ExcuteTip extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  /*弹出当前提示框*/
  open( data, isTask ) {
    this.data = data;
    this.isTask = isTask;
    this.refs.excuteTipModal.open();
  }

  stopHandle() {
    if ( this.isTask ) {
      AjaxReq.stopTask( { id: this.data.id }, ( data ) => {
        message.success( "结束成功" );
        this.cancelHandle();
      } );
    } else {
      AjaxReq.stopRule( { id: this.data.id }, ( data ) => {
        message.success( "结束成功" );
        this.cancelHandle();
      } )
    }

  }

  cancelHandle() {
    this.refs.excuteTipModal.close();
    this.props.backToList();
  }

  render() {
    return (
      <Modal ref="excuteTipModal">
        <ModalHeader>
          <h4 className="modal-title">提示</h4>
        </ModalHeader>
        <ModalBody>
          <div
            className="row text-center"
            style={{fontSize:"16px",height:"50px",lineHeight:"50px"}}>正在执行,是否结束？
          </div>
          <FormFooter
            className="row text-center"
            submitLabel="结束"
            submitClick={this.stopHandle.bind(this)}
            cancelClick={this.cancelHandle.bind(this)}/>
        </ModalBody>
      </Modal>
    );
  }
}
export default ExcuteTip