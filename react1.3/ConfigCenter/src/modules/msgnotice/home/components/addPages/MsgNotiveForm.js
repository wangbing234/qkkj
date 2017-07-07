/**
 * Created by zhongxia on 16/4/5.
 */
import React from 'react'
import {BfdRequest} from 'CommonComponent'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'CommonComponent/component/bdosmessage'
import {BaseValidate,RestrictInput} from 'CommonComponent'
import  ValidateInput from  "CommonComponent/component/validateinput"
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
let isSuccess = [];
let that;
class MsgNotiveForm extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
        this.state = {
            groupType: '邮件组',
            isNameReapot:false,
            ...this.props.data
        }

        this.rules = {
            groupName(validateVal) {
                return BaseValidate.validateInput({isRequired: true, label: "分组名称", value: validateVal, maxLength: 16});
            },
            remark(validateVal) {
                return BaseValidate.validateInput({isRequired: false, label: "备注", value: validateVal, maxLength: 255});
            }
        }
    }


    handleChange(name, event) {
        let newState = {};
        if (event && event.target) {
            newState[name] = name === "checked" ? event.target.checked : event.target.value;
        } else {
            newState[name] = event;
        }
        this.setState({...newState, validateState: false});
    }

    groupNameChange(name, event) {
        that.handleChange(name, event);
        that.state.isNameReapot=true;
        if(that.props.oldGroupName && that.props.oldGroupName!=event.target.value && event.target.value)
        {
            that.checkNameExistSuccess(event.target.value);
        }
        else if(!that.props.oldGroupName && event.target.value){
            that.checkNameExistSuccess(event.target.value);
        }
        else {
            that.state.isNameReapot=false;
        }
    }

    checkNameExistSuccess(groupName)
    {
            let groupNameExist=`${Server.authority}messageGroup/exist/${that.state.groupType}/${groupName}`;
            BfdRequest.ajaxGetData(groupNameExist,that.groupNameExistSuccess,null,false);

    }

    groupNameExistSuccess(data)
    {
        that.state.isNameReapot=data;
    }

    isSuccess(flag) {
        isSuccess.push(flag);
    }

    vaildate()
    {
        const obj = this.refs._from.validate(this.state);
        if (obj) {    //验证通过
            console.log('表单验证通过',obj.data);
            if(that.state.isNameReapot==true)
            {
                message.danger("消息组名称不能重复！");
            }
            return !that.state.isNameReapot;
        } else {              //验证失败
            console.log('表单验证失败');
        }
        return false;
    }

    //供步骤容器调用
    saveData()
    {
        var obj=  this.state;
        obj.addedByUserId=window.userName||"jupiter";
        obj.updatedByUserId=window.userName||"jupiter";
        return obj;
    }


    render() {
        isSuccess = [];
        that=this;
        return (
                    <Form horizontal isSuccess={this.isSuccess} ref="_from" rules={this.rules} style={{paddingLeft: 60}}>
                        <FormItem label="消息组名称"  name="groupName" required >
                            <RestrictInput className="form-control common-form-input" type="text"
                                tipString = "只能输入中文字母、数字、下划线、长度小于16个字符"  maxLength="16"
                                           value={this.state.groupName} restrict={/^[0-9a-zA-Z\u4E00-\u9FA5\_]+$/i}
                                           onChange={this.groupNameChange.bind(this,'groupName')}/>
                        </FormItem>
                        <FormItem label="类型" required  name="groupType">
                            <Select value={this.state.groupType}  onChange={this.handleChange.bind(this,'groupType')}>
                                <Option value="邮件组">邮件组</Option>
                                <Option value="短信组">短信组</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="备注"  name="remark">
                            <RestrictTextarea className="form-control" value={this.state.remark} type="textarea"
                                      tipString = "长度不能大于255个字符"  maxLength="255" wrap="hard" style={{display:"inline"}}
                                      onChange={this.handleChange.bind(this,'remark')} rows="5"/>
                        </FormItem>
                    </Form>
                );
    }
}

export default MsgNotiveForm