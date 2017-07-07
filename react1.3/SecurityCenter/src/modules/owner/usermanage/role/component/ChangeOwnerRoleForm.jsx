/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 改变租户所有者页面
 *
 ***************************************************/
import React from 'react'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import {RestrictInput,RestrictConst} from 'CommonComponent'
import   RegularConst from "CommonComponent/utils/RegularConst"
import Ajax from '../ajax/AjaxReq'

let that;
class ChangeOwnerRoleForm  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {}
        this.rules = {
            name: value => {
                return BaseValidate.validateInput({isRequired:true,label:"用户",value:(value=="请选择"?"":value)});
            }
        };
        this.roleList=[];
    }

    componentDidMount() {
        Ajax.listTenantUsersNotTenantOwner(null,(data)=>{
            this.roleList= data.data;
            this.setState();
        });
    }

    /**
     * 公用处理修改
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
        let rBoolean=that.refs.form.validate(that.state);
        return rBoolean;
    }

    render(){
        that=this;
        return(  <div style={{ paddingBottom: "23px"}}>
                        <Form ref="form" rules={this.rules}>
                            <FormItem label="用户" required name="name">
                                <Select value={this.state.name} onChange={this.handleChange.bind(this,"name")}
                                        className="common-select" placeholder="请选择">
                                    {this.roleList.map((item, index)=> {
                                        return (<Option key={index} value={item.id+"###"+item.userName}>{item.userName}</Option>)
                                    })}
                                </Select>
                            </FormItem>
                        </Form>
                        <span  style={{display:'inline-block',marginLeft: "64px",marginTop: "10px"}}>
                            注意：变更完成后，当前帐号马上失去租户所有者角色</span>
                    </div>
            );
    }
}

module.exports = ChangeOwnerRoleForm