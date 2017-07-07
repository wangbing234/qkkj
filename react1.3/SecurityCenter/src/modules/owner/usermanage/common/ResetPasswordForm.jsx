/***************************************************
 * 时间: 2016/7/21 15:55
 * 作者: bing.wang
 * 说明: 重置密码页面
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import {Modal,ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import {FormFooter,BaseValidate,RestrictInput,RestrictConst} from 'CommonComponent'
let that;
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
              let errorString=  BaseValidate.validateInput({isRequired:true,label:"确认密码",value:value})
                if(errorString)
                    return errorString
                if(this.state.userPassword!=value)
                {
                    return "确认密码必须和新密码相同！";
                }
                return "";
            }
        };
    }

    /**
     * 公用修改处理
     * @param dataField
     * @param e
     */
    handleChange(dataField,e){
        this.setState({[dataField]:e.target.value});
    }

    /**
     * 打开
     */
    open(){
        this.refs.modal.open();
    }

    /**
     * 关闭
     */
    close(){
        this.refs.modal.close();
    }

    /**
     * submit按钮提交操作
     * @param e
     */
    handleSubmit(e) {
        if (e) {
            e.preventDefault()
        }
        if (this.refs.form.validate(this.state)) {
            console.log('表单验证通过');
            this.state.data.userPassword=this.state.userPassword;
            this.state.data.reUserPassword=this.state.reUserPassword;
            this.state.data.status=3;
            this.props.changePassword(this.state.data);
        } else {
            console.log('表单验证失败');
        }
    }

    /**
     * 取消操作
     * @param e
     */
    handleCancel(e) {
        e.preventDefault();
        this.modal.close();
    }

    render(){
        that=this;
        return(
            <div>
                <Modal ref="modal" lock={true}>
                    <ModalHeader>
                        <h4>重置密码</h4>
                    </ModalHeader>
                    <ModalBody>
                        <Form horizontal ref="form" rules={this.rules}>
                            <FormItem label="新密码" name="userPassword" required>
                                <RestrictInput type="password" value={this.state.userPassword} name="userPassword"
                                               className="form-control common-form-input" style={{width:250}}
                                               onChange={this.handleChange.bind(this,"userPassword")}
                                               restrict={RestrictConst.NUM_STRING_POINT_UNDERLINE}
                                               tipString="必须包含大小写字母、数字、特殊字符中的两种；长度为8-16个字符；不能与用户名或用户名倒写重名"/>
                            </FormItem>
                            <FormItem label="确认密码" name="reUserPassword" required>
                                <RestrictInput type="password" value={this.state.reUserPassword}
                                               className="form-control common-form-input" style={{width:250}}
                                               onChange={this.handleChange.bind(this,"reUserPassword")}/>
                            </FormItem>
                        </Form>
                        <FormFooter className="common-center" submitClick={this.handleSubmit.bind(this)}
                                    cancelClick={this.close.bind(this)}></FormFooter>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

module.exports = ResetPasswordForm;