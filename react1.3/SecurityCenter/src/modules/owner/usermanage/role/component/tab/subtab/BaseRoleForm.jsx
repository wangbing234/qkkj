/***************************************************
 * 时间: 2016/7/21 17:27
 * 作者: bing.wang
 * 说明: 角色基本信息
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import {RestrictInput,RestrictConst} from 'CommonComponent'
import   RegularConst from "CommonComponent/utils/RegularConst"
import AjaxReq from '../../../ajax/AjaxReq'
let that;
class AddRoleForm  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {isSubmit:false,...this.props.data}//角色详情中使用
        this.rules = {
            roleName: value => {
                let msg = BaseValidate.validateInput({isRequired: true, label: "角色", value: value, maxLength:64});
                if(this.isExistName){
                    msg = '角色名已存在，请重新输入';
                }
                return msg;
            },
            comment: value => {
                return BaseValidate.validateInput({isRequired: false, label: "描述", value: value});
            }
        };
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
    getData()
    {
        return that.state;
    }

    /**
     * 处理修改
     * @param dataField
     * @param evt
     */
    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.setState({[dataField]: value});
        if(dataField == 'roleName'){
            this.isExistName = false;
        }
    }

    /**角色失去焦点**/
    focusOutHandler(evt){
        let name = evt.target.value;
        let param = {roleName:name};
        AjaxReq.roleIsExists(param,(result)=>{
            this.isExistName = result;
            this.refs.roleName.validate(name);
        });

    }


    render(){
        that = this;
        let disabled=this.props.type=="readOnly"?{disabled:true}:{};
        return (
            <div className="p-container" style={{marginLeft:40}}>
                <Form ref="form" rules={this.rules}>
                    <FormItem label="角色名称" ref="roleName" name="roleName">
                        <RestrictInput type="text" className="form-control common-form-input"   {...disabled}
                                       onChange={this.handleChange.bind(this,"roleName")} value={this.state.roleName}
                                       restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                                       onBlur={this.focusOutHandler.bind(this)}
                                       tipString="只能输入中文,数字字母、数字、下划线，且必须以字母开头，长度为0-64个字符"
                        />
                    </FormItem>
                    <FormItem label="描述" name="comment">
                        <textarea className="form-control common-form-input" name="comment" value={this.state.comment} style={{height:80}}
                                  onChange={this.handleChange.bind(this,"comment")}  {...disabled}/>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

module.exports = AddRoleForm;