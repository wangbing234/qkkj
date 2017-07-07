/**
 * Created by zhongxia on 16/4/5.
 */
import React from 'react'
import {BfdRequest} from 'CommonComponent'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import {BaseValidate,RestrictInput} from 'CommonComponent'

let isSuccess = [];
let that;
class MsgNotiveForm extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
        this.state = {
            groupType: '邮件组',
            ...this.props.data
        }

        this.rules = {
            groupName(validateVal) {
                return BaseValidate.validateInput({isRequired:true,label:"分组名称",value:validateVal,maxLength:16});
            },
            remark(validateVal) {
                return BaseValidate.validateInput({isRequired:false,label:"备注",value:validateVal,maxLength:255});
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

    isSuccess(flag) {
        isSuccess.push(flag);
    }

    vaildate()
    {
        const obj = this.refs._from.validate(this.state);
        if (obj) {    //验证通过
            console.log('表单验证通过',obj.data);
            return true;
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
        return (
                <div className="title_container">
                        <Form horizontal isSuccess={this.isSuccess} ref="_from" rules={this.rules} style={{paddingLeft: 10}}>
                            <FormItem label="消息组名称"  name="groupName" required >
                                <RestrictInput className="form-control common-form-input" type="text"
                                    tipString = "只能输入中文字母、数字、下划线、长度小于16个字符" disabled
                                               value={this.state.groupName} restrict={/^[0-9a-zA-Z\u4E00-\u9FA5\_]+$/i}
                                               onChange={this.handleChange.bind(this,'groupName')}/>
                            </FormItem>
                            <FormItem label="类型" required  name="groupType">
                                <Select value={this.state.groupType} disabled onChange={this.handleChange.bind(this,'groupType')}>
                                    <Option value="邮件组">邮件组</Option>
                                    <Option value="短信组">短信组</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="备注"  name="remark">
                                <textarea disabled className="form-control" value={this.state.remark} type="textarea"
                                          onChange={this.handleChange.bind(this,'remark')} rows="3" style={{height:80}}/>
                            </FormItem>
                        </Form>
                </div>
                );
    }
}

export default MsgNotiveForm