import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
const ConfirmModal = React.createClass({
    open() {
      this.refs.modal.open();
    },
    clickHandler(){
      this.props.yesHandler();
      this.refs.modal.close();
    },
    cancelHandler(){
        //调用关闭方法
        this.refs.modal.close();
    },
    render(){
        return (<Modal ref="modal">
                <ModalHeader>
                    <h4 className="modal-title">提示</h4>
                </ModalHeader>
                <ModalBody>
                    <div className="text-center" style={{marginBottom:15}}>
                        <div style={{marginBottom:40}}>
                            {this.props.msg?this.props.msg:'是否确认删除?'}
                        </div>
                        <div>
                            <button type="button" className="btn btn-primary common-margin-right" onClick={this.clickHandler}>确认</button>
                            <button type="button" className="btn btn-default" onClick={this.cancelHandler}>取消</button>
                        </div>
                    </div>


                </ModalBody>
            </Modal>

        );
    }
});
module.exports = ConfirmModal;