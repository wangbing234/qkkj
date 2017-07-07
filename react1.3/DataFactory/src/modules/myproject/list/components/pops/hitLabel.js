import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import FormFooter from 'CommonComponent/component/formfooter'
let isSuccess;
let HitLabel = React.createClass({
    open(){
        this.refs.modal.open();
    },
    handleChange(dataField,e){
        this.setState({[dataField]:e.target.value});
    },
    getInitialState() {
        return {
            visible: false,
            ...this.props
        }
    },

    //submit按钮提交操作
    handleSubmit(e) {
        this.setState({validateState:true});
        const obj = Form.handleData(this.state, isSuccess);
        if (obj.isPass) {    //验证通过
            this.refs.modal.close();
        } else {              //验证失败
            console.log('表单验证失败');
        }
        e.preventDefault();
    },
    //获取验证是否通过状态，并存放到isSuccess数组中。
    isSuccess(flag){
        isSuccess.push(flag);
    },
    handleCancel() {
        this.refs.modal.close();
    },

    render() {
        isSuccess = [];
        const validates = [{
            validateVal: this.state.version,
            required: '请填写版本名称',
            handle: function() {
                let s;
                if (!this.validateVal && this.required) {
                    s = this.required;
                }  else {
                    s = 'success'
                }
                return s;
            }
        }];

        return (
            <Modal  ref="modal">
                <ModalHeader>
                    <h4 className="modal-title">打标签</h4>
                </ModalHeader>
                <ModalBody>
                    <div className="common-margin">
                        <Form horizontal  isSuccess={this.isSuccess} sibmitStatus={this.state.isSubmit}>
                            <FormItem label="版本名称:" validate={validates[0]} required>
                                <input type="text" className="form-control" value={this.state.version} onChange={this.handleChange.bind(this,"version")}/>
                            </FormItem>
                        </Form>
                        <FormFooter className="row text-center" style={{marginTop:30}} btnStyle={{width:"70px !important"}}
                                    submitClick={this.handleSubmit} cancelClick={this.handleCancel}/>
                    </div>
                </ModalBody>
            </Modal>

        );
    }
});

export default HitLabel;
