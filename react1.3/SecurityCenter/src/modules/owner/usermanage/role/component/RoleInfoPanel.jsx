/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 角色信息页面
 *
 ***************************************************/
import React from 'react'
import StepsSubmit from 'CommonComponent/component/stepssubmit'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import AddRoleForm from './tab/AddRoleForm'
import FunUserInfoForm from '../../user/component/tabs/FunUserInfoForm'
import ReourceUserInfoForm from '../../user/component/tabs/ReourceUserInfoForm'
import DataInfoForm from './tab/DataInfoForm'

class RoleInfoPanel  extends React.Component{

    constructor(prop) {
        super(prop);
        this.breadArr = [{
            text: '角色管理',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '增加角色',
            url: ''
        }];
    }

    render(){
        var stepArray=[
            {title:"角色基本信息",ui:AddRoleForm,props:null},
            {title:"功能授权",ui:FunUserInfoForm,props:{operatorType:"role"}},
            {title:"资源授权",ui:ReourceUserInfoForm,props:{operatorType:"role"}},
            {title:"数据权限",ui:DataInfoForm,props:{cancelAddUser:this.props.cancelAddUser}}]
        return (
            <div  className="module-edit-container  common-container-border role_info_panel">
                <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelAddUser}>
                     <StepsSubmit stepArray={stepArray} cancelClick={this.props.cancelAddUser}/>
                </EditPanel>
            </div>

        );
    }
}

module.exports = RoleInfoPanel;