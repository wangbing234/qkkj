/***************************************************
 * 时间: 2016/7/21 16:02
 * 作者: bing.wang
 * 说明:用户基本信息
 *
 ***************************************************/
import React from 'react'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory'
import BaseUserInfo from './subtab/BaseUserInfo'
import RoleUserInfo from './subtab/RoleUserInfo'
import Transfer from 'bfd-ui/lib/Transfer'
import Ajax from '../../ajax/AjaxReq'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

let that=this;
class UserInfoFormCommon  extends React.Component{
    constructor(prop) {
        super(prop);
    }

    /**
     * 验证处理
     */
    vaildate(){
        if (that.doVaildate()) {
            console.log('表单验证通过');
            that.addUserHander();
        } else {
            console.log('表单验证失败');
        }
    }

    addUserHander()
    {
        let getData={tenantId:window._currentUser.tenantId,...that.getData()};
        Ajax.editUser(getData,
            (data) => {
                that.props.parent.nextStep();
            })
    }


    /**
     * 获取验证
     */
    getData()
    {
        var bData= that.refs.baseUserInfo.getData();
        var rData= that.refs.roleUserInfo.getData();
        let rDataArray=CommonUtil.getStringArrayByObjectArray(rData,"id");
        return {newRoleIds:rData[0],oldRoleIds:rData[1],user:bData}
    }

    /**
     * 时间验证
     * @returns {*|*|boolean|boolean}
     */
    doVaildate(){
        return that.refs.baseUserInfo.doVaildate();
    }

    render() {
        that=this;
        return (
            <div>
                    <FormCategory>
                            <FormCategoryItem name="基本信息">
                                <BaseUserInfo ref="baseUserInfo" {...this.props}/>
                            </FormCategoryItem>

                            <FormCategoryItem name="角色">
                                <RoleUserInfo ref="roleUserInfo" {...this.props}/>
                            </FormCategoryItem>
                    </FormCategory>
                </div>
        );
    }
}

module.exports = UserInfoFormCommon;