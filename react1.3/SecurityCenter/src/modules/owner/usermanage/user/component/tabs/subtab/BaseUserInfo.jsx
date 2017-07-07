/***************************************************
 * 时间: 2016/7/21 16:02
 * 作者: bing.wang
 * 说明:用户基本信息配置
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import {RestrictInput,RestrictConst} from 'CommonComponent'
import   RegularConst from "CommonComponent/utils/RegularConst"
import Ajax from '../../../ajax/AjaxReq'
import AuthButton from 'CommonComponent/component/authbutton'

let that;
class BaseUserInfo  extends React.Component{
    constructor(prop) {
        super(prop);
        this.canSeePwd = false;
        this.pwdIcon = 'eye-slash';
        this.state = {
            userPassword:"jupiter123",
            ...this.props.data,
            status:"0"
        };
        ;
        let that=this;
        this.rules = {
            userName: value => {
                let resultName= BaseValidate.validateInput({isRequired: true, label: "用户名", value: value, minLength: 4,maxLength:16});
                //如果验证通过，并且不是编辑状态
                if(!resultName && !that.props.isEdit)
                {
                    if((!that.oldUserName || (that.oldUserName && that.oldUserName!=that.state.userName)) && that.state.userName)
                    {
                            Ajax.isExistsUserName({userName:that.state.userName},(data)=>{
                                resultName=data.data?data.msg:"";
                            })
                    }
                }
                return resultName;
            },

    //    <FormItem label="密码" name="userPassword" required>
    //        <RestrictInput type="password" name="password" className="form-control common-form-input"
    //                       onChange={this.handleChange.bind(this,"userPassword")  }
    //                       restrict="" value={this.state.userPassword}
    //                       tipString="必须包含大小写字母、数字、特殊字符中的两种；长度为8-16个字符；不能与用户名或用户名倒写重名"/>
    //    </FormItem>
    //
    //    <FormItem label="确认密码" name="reUserPassword" required>
    //    <RestrictInput type="password" className="form-control common-form-input" value={this.state.reUserPassword}
    //    onChange={this.handleChange.bind(this,"reUserPassword")}/>
    //</FormItem>
            userPassword: value => {
                return BaseValidate.validateInput({isRequired: true, label: "密码", value: value, minLength: 8,maxLength:16});
            },
    //        reUserPassword: value => {
    //            return BaseValidate.validateInput({isRequired: true, label: "确认密码", value: value});
    //        },
            phoneNumber: value => {
                return BaseValidate.validateInput({
                    isRequired: false,
                    label: "手机",
                    value: value,
                    regExp: RegularConst.PHONE_STRING.name
                });
            },
            email: value => {
                return BaseValidate.validateInput({isRequired: false, label: "邮箱", value: value,regExp: RegularConst.EMAIL_STRING.name});
            }
        };

        this.oldUserName=$.extend("",this.state.userName);
    }

    /**
     * 公用修改处理
     * @param dataField
     * @param evt
     */
    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.setState({[dataField]: value});
    }

    /**
     * 验证
     * @returns {*}
     */
    doVaildate(){
        return that.refs.form.validate(that.state);
    }

    /**
     * 获取数据
     * @returns {*}
     */
    getData(){
        ;
        return that.state;
    }

    /**点击显示或隐藏密码**/
    seePwd(){
        this.canSeePwd = !this.canSeePwd;
        if(this.pwdIcon == 'eye-slash'){
            this.pwdIcon = 'eye';
        } else{
            this.pwdIcon = 'eye-slash';
        }
        this.setState({});
    }

    render() {
        let disabled=this.props.type=="readOnly"?{disabled:true}:{};
        that=this;
        let passWordForm;
        if(!this.props.data)
        {
            passWordForm= <FormItem label="密码" name="userPassword" required>
                <div style={{display:'inline'}}>
                <RestrictInput type={this.canSeePwd?'text':'password'} name="password" className="form-control common-form-input"
                               onChange={this.handleChange.bind(this,"userPassword")}
                               restrict={RestrictConst.NOT_CHARS} value={this.state.userPassword}  minLength="8"   maxLength="16"
                               tipString="必须包含大小写字母、数字、特殊字符中的两种；长度为8-16个字符；不能与用户名或用户名倒写重名"/>
                <AuthButton renderType="icon" type={this.pwdIcon} title="查看" onClick={this.seePwd.bind(this)} style={{lineHeight:'30px',marginLeft:'5px'}}/>
            </div>
            </FormItem>
        }
        return (
                <Form ref="form" rules={this.rules}>
                    <FormItem label="用户名" required name="userName">
                        <RestrictInput type="text" className="form-control common-form-input"
                                       onChange={this.handleChange.bind(this,"userName")} value={this.state.userName}
                                       restrict={RestrictConst.NUM_STRING_UNDERLINE_AT_POINT}
                                       disabled={this.props.isEdit}  {...disabled}  maxLength="16"
                                       tipString="只能输入字母、数字、下划线、点和@，且必须以字母开头，长度为4-16个字符"
                        />
                    </FormItem>

                    {passWordForm}

                    <FormItem label="手机" name="phoneNumber">
                        <RestrictInput type="text" className="form-control common-form-input" value={this.state.phoneNumber}
                                       onChange={this.handleChange.bind(this,"phoneNumber")}
                                       restrict={RestrictConst.NUM} {...disabled}
                                       tipString="格式：13500000000"/>
                    </FormItem>

                    <FormItem label="邮箱" name="email">
                        <RestrictInput type="text" className="form-control common-form-input"  {...disabled}
                                       onChange={this.handleChange.bind(this,"email")} value={this.state.email}
                                       restrict={RestrictConst.EMAIL_STRING}/>
                    </FormItem>
                    <FormItem label="状态" name="status">
                        <RadioGroup defaultValue={""+(this.state.status?this.state.status:0)}  {...disabled} onChange={this.handleChange.bind(this,"status")}>
                            <Radio value="0">启用</Radio>
                            <Radio value="1">禁用</Radio>
                        </RadioGroup>
                    </FormItem>
                    </Form>

        );
    }
}

module.exports = BaseUserInfo;