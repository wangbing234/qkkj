/***************************************************
 * 时间: 2016/7/21 16:02
 * 作者: bing.wang
 * 说明:角色基本信息配置
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import {RestrictInput,RestrictConst} from 'CommonComponent'
import   RegularConst from "CommonComponent/utils/RegularConst"
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory'
import Ajax from '../../../ajax/AjaxReq'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import Transfer from 'bfd-ui/lib/Transfer'
let that=this;
class RoleUserInfo  extends React.Component{
    constructor(prop) {
        super(prop);
        this.state = {sourceData:[],targetData:[],oldRole:[]};
    }


    componentDidMount() {
        this.getPartUser();
    }

    /**
     * 获取部分用户
     */
    getPartUser(){
        let that=this;
        let _userName=this.props.data?this.props.data.userName:null;
        if(_userName)
        {
            var info15={ userName:_userName};
            Ajax.listRolesByUserName(info15,(data) => {
                that.getPartUserResult(data.data);
            });
        }
        else {
            that.getPartUserResult([]);
        }
    }


    /**
     * 获取部分用户结果
     * @param data
     */
    getPartUserResult(data)
    {
        that.state.targetData=data;
        that.state.oldRole=$.extend([],data,true);
        that.getAllUser();
    }


    /**
     * 获取数据
     * @returns {{}}
     */
    getData()
    {
        return [that.getNewId(),that.getOldId()];//新id，旧id
    }

    getNewId(){
        let roleId= [];
        that.state.targetData.map((item,index)=>{
            roleId.push(item.id);
        })
        return roleId;
    }

    getOldId(){
        let roleId= [];
        that.state.oldRole.map((item,index)=>{
            roleId.push(item.id);
        })
        return roleId;
    }


    /**
     * 获取所有用户
     */
    getAllUser() {
        var info12={};
        Ajax.listRolesByTenant(info12,(data) => {
            let resultData= CommonUtil.removeFormOtherArray(data.data,that.state.targetData,"id");
            that.setState({ sourceData: resultData});
        });
    }


    render() {
        let disabled=this.props.type=="readOnly"?{disabled:true}:{};
        that=this;
        return (
                <div style={{height:310}} {...disabled}>
                      <Transfer height={200} title={"已选的用户"} sdata={this.state.sourceData} tdata={this.state.targetData} render={item => `${item.roleName}`} />
                </div>

        );
    }
}

module.exports = RoleUserInfo;