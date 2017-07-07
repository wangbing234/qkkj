import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import {Modal,ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import FormFooter from 'CommonComponent/component/formfooter'
import RestrictInput from 'CommonComponent/component/restrictinput'
import BaseValidate from 'CommonComponent/utils/BaseValidate'

class ResetPasswordForm  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            userPassword:'',
            reUserPassword:''
        };

        this.rules = {
            userPassword:value => {
                return BaseValidate.validateInput({isRequired:true,label:"新密码",value:value,regExp: RestrictConst.PWD});
            },
            reUserPassword:value => {
                let msg = BaseValidate.validateInput({isRequired:true,label:"确认密码",value:value,regExp: RestrictConst.PWD});
                if (!this.pwdIsEqual(value)) {
                    msg = "两次输入密码不一致";
                }
                return msg;
            }
        };
    }

    initFunc(uName){
        this.setState({userName:uName,userPassword:'',reUserPassword:''});
    }

    handleChange(dataField,e){
        this.setState({[dataField]:e.target.value});
    }

    open(){
        this.refs.modal.open();
    }

    close(){
        this.refs.modal.close();
    }

    pwdIsEqual(reUserPassword) {
        return this.state.userPassword == reUserPassword;
    }

    //submit按钮提交操作
    handleSubmit(e) {
        if (e) {
            e.preventDefault()
        }
        if (this.refs.form.validate(this.state)) {
                //验证通过
                this.props.changePassword({userName:this.state.userName,userPassword:this.state.userPassword});
        } else {
            console.log('表单验证失败');
        }
    }


    handleCancel(e) {
        e.preventDefault();
        this.modal.close();
    }


    render(){
        return(<div>
                <Modal  ref="modal" >
                    <ModalHeader>
                        <h4>重置密码</h4>
                    </ModalHeader>
                    <ModalBody>
                        <Form horizontal ref="form" rules={this.rules} >
                            <FormItem label="新密码" name="userPassword" required >
                                <RestrictInput type="password" value={this.state.userPassword} name="userPassword" className="form-control common-form-input"
                                               onChange={this.handleChange.bind(this,"userPassword")}
                                               restrict=""  style={{width:250}}
                                               tipString="必须包含大小写字母、数字、特殊字符中的两种；长度为8-16个字符；不能与用户名或用户名倒写重名"/>
                            </FormItem>
                            <FormItem label="确认密码" name="reUserPassword" required>
                                <RestrictInput type="password" value={this.state.reUserPassword} className="form-control common-form-input"
                                               style={{width:250}}    onChange={this.handleChange.bind(this,"reUserPassword")}/>
                            </FormItem>
                        </Form>
                        <FormFooter className="common-center"  submitClick={this.handleSubmit.bind(this)} cancelClick={this.close.bind(this)}></FormFooter>
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}

module.exports = ResetPasswordForm;