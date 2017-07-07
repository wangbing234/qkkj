import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import FormFooter from 'CommonComponent/component/formfooter'
const Import = React.createClass({
    open(){
        this.refs.modal.open();
    },
    getInitialState() {
        return {
            visible: false,
            ...this.props
        }
    },
    handleSubmit(e) {
        //this.setState({validateState:true});
        //const obj = Form.handleData(this.state, isSuccess);
        //if (obj.isPass) {    //验证通过
            this.refs.modal.close();
        //} else {              //验证失败
        //    console.log('表单验证失败');
        //}
        //e.preventDefault();
    },
    handleCancel() {
        this.refs.modal.close();
    },

    componentDidMount(){
      
      var data = this.props.data;
      
    },

    render() {
        return (
                <Modal ref="modal" onCancel={ this.handleCancel }>
                    <ModalHeader>
                        <h4 className="modal-title">提示</h4>
                    </ModalHeader>
                    <ModalBody>
                        <div className="common-margin text-center">
                            <span style={{fontSize:14}}>选择文件：</span>
                            <input type="text" className="form-control common-input-width" style={{marginRight:10, width:"220px !important",height:"30px !important"}} placeholder="选择文件"/>
                            <button type="button" className="btn btn-primary common-btn" style={{width:"70px !important",marginTop:"-4px"}}>浏览</button>
                        </div>
                        <FormFooter className="row text-center" btnStyle={{width:"70px !important"}}
                                    submitClick={this.handleSubmit} cancelClick={this.handleCancel}/>
                    </ModalBody>
                </Modal>
        );
    }
});

export default Import;
