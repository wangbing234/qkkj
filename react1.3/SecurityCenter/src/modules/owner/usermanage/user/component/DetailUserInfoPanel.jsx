/***************************************************
 * 时间: 2016/7/21 16:00
 * 作者: bing.wang
 * 说明: 用户详情
 *
 ***************************************************/
import React from 'react'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory'
import StepsSubmit from 'CommonComponent/component/stepssubmit'
import BaseUserInfo from './tabs/subtab/BaseUserInfo'
import RoleUserInfo from './tabs/subtab/RoleUserInfo'
import FunUserInfoForm from './tabs/FunUserInfoForm';
import ReourceUserInfoForm from './tabs/ReourceUserInfoForm';
import EditPanel from 'CommonComponent/component/bdoseditpanel'
class UserInfoPanel  extends React.Component{

	constructor(prop) {
		super(prop);
		this.breadArr = [{
			text: '用户管理',
			url: ''//如果不需要跳转url可以为空或不写url
		}, {
			text: '用户详情',
			url: ''
		}];
	}

    render(){
		return (
			<div  className="module-edit-container  common-container-border">
				<EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.props.cancelClick}>
				<FormCategory>
					<FormCategoryItem name="基本信息">
						<BaseUserInfo ref="baseUserInfo" {...this.props}/>
					</FormCategoryItem>
					<FormCategoryItem name="角色">
						<RoleUserInfo ref="roleUserInfo" {...this.props}/>
					</FormCategoryItem>
					<FormCategoryItem name="功能权限">
						<FunUserInfoForm {...this.props}/>
					</FormCategoryItem>
					<FormCategoryItem name="资源权限">
						<ReourceUserInfoForm {...this.props}/>
					</FormCategoryItem>
				</FormCategory>

				<button type="button" className="btn btn-default common-btn"  style={{marginLeft: 171,marginTop:30}} onClick={this.props.cancelClick}>取消</button>
			</EditPanel>
			</div>
		);
	}
}

module.exports = UserInfoPanel;