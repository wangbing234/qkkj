/***************************************************
 * 时间: 2016/7/21 17:27
 * 作者: bing.wang
 * 说明: 角色用户
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
        this.state = {sourceData:[],targetData:[],oldRole:[],...this.props};
    }


    componentDidMount() {
        //如果是租户所有者
        if(this.state.data && this.state.data.roleName=="租户所有者")
        {
            this.setState({targetData:[{userName:window._currentUser.userName}]});
        }
        else{
            this.getPartUser();
        }
    }

    /**
     * 获取选中的用户
     */
    getPartUser(){
        let roleId=this.state.id;
        //详情传递的数据
        if(this.state.data && this.state.data.id)
        {
            roleId=this.state.data.id;
        }
        if(roleId)
        {
            var info12={
                "id":roleId,//角色id
            };
            let that=this;
            Ajax.listUsersByRoleId(info12,(data) => {
                that.state.targetData=data.data;
                that.state.oldRole=$.extend([],data.data,true)
                that.getAllUser();
            });
        }
        else
            that.getAllUser();
    }

    /**
     * 验证
     * @returns {boolean}
     */
    doVaildate()
    {
        return true;
    }

    /**
     * 获取数据
     * @returns {{sourceData: Array, targetData: Array, oldRole: Array}|*}
     */
    getData()
    {
        return this.state
    }

    /**
     * 获取所有的数据
     */
    getAllUser() {
        var info11={"tenantId":window._currentUser.tenantId};//租户id
        Ajax.listUsersByTenant(info11,(data) => {
            let resultData= CommonUtil.removeFormOtherArray(data.data,that.state.targetData,"id");
            that.setState({ sourceData: resultData});
        });
    }


    render() {
        let disabled=this.props.type=="readOnly"?{disabled:true}:{};
        that=this;
        return (
            <div style={{height:310}} {...disabled}>
                <Transfer height={200} title={"已选的用户"} {...disabled} sdata={this.state.sourceData} tdata={this.state.targetData}
                          render={item => `${item.userName}`} />
            </div>

        );
    }
}

module.exports = RoleUserInfo;