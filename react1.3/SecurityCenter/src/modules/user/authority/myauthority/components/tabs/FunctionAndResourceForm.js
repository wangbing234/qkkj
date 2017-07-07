/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:功能权限页面
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import   Ajax from  "../../ajax/AjaxReq"
import {RestrictInput,RestrictConst} from 'CommonComponent'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import   RegularConst from "CommonComponent/utils/RegularConst"
import { Select2 ,Option2} from 'bfd-ui/lib/Select2'
import TableTree from 'bfd-ui/lib/TableTree'
import CommonUtil from 'CommonComponent/utils/CommonUtil'


const AUTH_TYPE=[{name:"功能权限",value:0},{name:"数据权限",value:1},{name:"资源权限",value:2}];
let that;
class FunctionAndResourceForm extends React.Component {
    constructor(prop) {
        super(prop)
        that = this;
        this.state = {...this.props}

        this.rules = {
            applyName: value => {
                return BaseValidate.validateInput({isRequired: true, label: "申请名称", value: value,maxLength:64});
            },
            applyReason: value => {
                return BaseValidate.validateInput({isRequired:false,label:"描述",value,maxLength:255});
            }
        };

        this.functionColumns = [ {
            title: "功能名称",
            key:"checked",
            render(item) {
                return <Checkbox disabled="true"  checked={item.checked}>{item.name}</Checkbox>
            }
        }];
        this.resourceColumns = [{
            title: "资源名称",
            key: 'function',
            render(item) {
                return <Checkbox disabled="true" checked={item.checked} >{item.name}</Checkbox>
            }
        }];
    }

    vaildate(){
        let result= that.doVaildate();
        if(result)
        {

            that.handleOkAjax();
        }
    }

    doVaildate(){
        return that.refs.form.validate(that.state);
    }

    //获取
    handleOkAjax() {
        var info14={"pageSize":"15"};
        Ajax.listByTenant(info14,(data) => {
            that.props.cancelClick();
        })
    }

    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.setState({[dataField]: value});
    }


    render() {
        that=this;
        let columns;
        if (this.props.applyType === 0) {
            columns =  this.functionColumns;
        } else if (this.props.applyType === 2) {
            columns =  this.resourceColumns;
        }
        return (<div className="p-container">
            <Form ref="form" rules={this.rules}>
                <FormItem label="申请名称" required name="applyName">
                    <RestrictInput type="text" className="form-control common-form-input"
                                   onChange={this.handleChange.bind(this,"applyName")}
                                   value={this.state.applyName}
                                   restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                                   tipString="只能输入中文、字母、数字、下划线、长度小于64个字符" />
                </FormItem>
                <FormItem   label="申请类型" name="applyType">
                    <Select2 className="common-select" value={this.state.applyType} disabled="true">
                        {AUTH_TYPE.map((item,index)=>{return (<Option2 key={item.value} value={item.value}>{item.name}</Option2>)})}
                    </Select2>
                </FormItem>
                <FormItem  label="申请内容"  name="content" >
                    <div style={{width:400}} >
                        <TableTree  columns={columns} data={this.props.data}/>
                    </div>
                </FormItem>
                <FormItem  label="申请理由"  name="applyReason" >
                    <RestrictTextarea className="form-control common-textarea"
                                      value={this.state.applyReason}
                                      onChange={this.handleChange.bind(this,"applyReason")}/>
                </FormItem>
            </Form>
        </div>);
    }
}

module.exports = FunctionAndResourceForm;
