/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 增加角色页面
 *
 ***************************************************/
import React from 'react'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory'
import BaseRoleForm from './subtab/BaseRoleForm'
import RoleUserInfo from './subtab/RoleUserInfo'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import Ajax from '../../ajax/AjaxReq'
let that=this;
class UserInfoFormCommon  extends React.Component{
    constructor(prop) {
        super(prop);
        this.state={};
    }

    /**
     * 验证方法
     */
    vaildate(){
        if (that.doVaildate()) {
            console.log('表单验证通过');
            let baseUserInfo= that.refs.baseUserInfo.getData();
            let roleUserInfo=that.refs.roleUserInfo.getData()
            var info13={role:{id:"",roleName:baseUserInfo.roleName,comment:baseUserInfo.comment},
                oldUserNames:[],
                newUserNames:CommonUtil.transferObjectArray(roleUserInfo.targetData,"userName")
            };

            Ajax.editRoleAssociateUser(info13,(data) => {
                that.state.roleId=data.data;
                that.props.parent.nextStep();
            });

        } else {
            console.log('表单验证失败');
        }
    }

    /**
     * 验证处理
     * @returns {*|boolean}
     */
    doVaildate(){
        return that.refs.baseUserInfo.doVaildate();
    }

    getData(){
        return {...this.state,...this.refs.baseUserInfo.getData()}
    }

    render() {
        that=this;
        return (
            <div>
                <FormCategory>
                    <FormCategoryItem name="角色基本信息">
                        <BaseRoleForm ref="baseUserInfo"/>
                    </FormCategoryItem>

                    <FormCategoryItem name="用户管理">
                        <RoleUserInfo ref="roleUserInfo"/>
                    </FormCategoryItem>
                </FormCategory>
            </div>
        );
    }
}

module.exports = UserInfoFormCommon;