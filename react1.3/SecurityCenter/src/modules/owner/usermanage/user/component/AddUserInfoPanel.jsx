/***************************************************
 * 时间: 2016/7/21 16:00
 * 作者: bing.wang
 * 说明: 增加用户页面
 *
 ***************************************************/
import React from 'react'
import StepsSubmit from 'CommonComponent/component/stepssubmit'
import UserInfoFormCommon from './tabs/UserInfoFormCommon'
import FunUserInfoForm from './tabs/FunUserInfoForm'
import ReourceUserInfoForm from './tabs/ReourceUserInfoForm'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
class UserInfoPanel  extends React.Component{
	constructor(prop) {
		super(prop);
		this.breadArr = [{
			text: '用户管理',
			url: ''//如果不需要跳转url可以为空或不写url
		}, {
			text: '新增用户',
			url: ''
		}];
	}

    render(){
		var stepArray=[
			{title:"用户基本信息",ui:UserInfoFormCommon,props:null},
			{title:"功能授权",ui:FunUserInfoForm},
			{title:"资源授权",ui:ReourceUserInfoForm,props:{cancelAddQueryUser:this.props.cancelAddUser,operatorType:"user"}}]
		return (
			<div  className="module-edit-container  common-container-border">
				<EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelAddUser}>
				<StepsSubmit stepArray={stepArray} cancelClick={this.props.cancelAddUser}/>
				</EditPanel>
			</div>
		);
	}
}

module.exports = UserInfoPanel;