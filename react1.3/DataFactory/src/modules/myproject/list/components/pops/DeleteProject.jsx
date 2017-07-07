import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import FormFooter from '../../../../../common/js/component/FormFooter'
class DeleteProject extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    open(){
        this.refs.modal.open();
    }
    handleCancel(e){
        this.refs.modal.close();
    }
    render(){
        return (<Modal ref="modal">
            <ModalHeader>
                <h4>提示</h4>
            </ModalHeader>
            <ModalBody>
                <div className="row text-center myproject-deletePanel-content">
                    <span>确定要删除吗？</span>
                </div>
            </ModalBody>
            <FormFooter className="row text-center" btnStyle={{width:"70px !important", marginBottom:60}}
                        submitClick={this.props.deleteSubmit} cancelClick={this.handleCancel.bind(this)}/>
        </Modal>);
    }
}
export default DeleteProject