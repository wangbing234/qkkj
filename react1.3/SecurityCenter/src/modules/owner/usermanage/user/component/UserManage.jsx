/***************************************************
 * 时间: 2016/7/21 16:00
 * 作者: bing.wang
 * 说明: 用户主页
 *
 ***************************************************/
import React from 'react'
import AddUserInfoPanel from './AddUserInfoPanel'
import EditUserInfoPanel from './EditUserInfoPanel'
import EditFunUserInfoPanel from './EditFunUserInfoPanel'
import EditReourceUserInfoPanel from './EditReourceUserInfoPanel'
import DetailUserInfoPanel from './DetailUserInfoPanel'
import UserManageList from './UserManageList'

let that;
const USER_ADD_USER = 'user_add_user';//用户界面- 新增用户界面的唯一类型标识
const USERMANAGE_LIST = 'usermanage_list';// 用户/用户管理界面的唯一类型标识
const USER_EDIT_USER = 'user_edit_user';// 用户/用户管理界面的唯一类型标识
const USER_RESOUCE_DATA_AUTH = 'user_resouce_data_auth';// 编辑资源权限
const USER_EDIT_FUN_AUTH = 'user_edit_fun_auth';// 编辑功能权限
const USER_DETAIL_USER = 'user_detail_user';// 编辑功能权限
class UserManage  extends React.Component{

	constructor(prop) {
		super(prop);
		this.state = {viewType: USERMANAGE_LIST}
	}

	/**
	 * 取消添加用户
	 * @param value
     */
	cancelAddUser(value) {
		this.setState({viewType:USERMANAGE_LIST});
	}

	cancelAddQueryUser(sta)
	{
		this.setState({viewType:USERMANAGE_LIST});
	}

	/**
	 * 编辑用户
	 * @param data
     */
    listAddUser(data) {
		this.setState({viewType:USER_ADD_USER,data:data});
    }

	/**
	 * 编辑用户
	 * @param data
	 * @param sign
     * @param e
     */
	editUser(data,sign,e){
		;
		that.setState({viewType:sign,data:data});
	}

	render() {
		let renderView;
		that = this;
		switch (this.state.viewType){
			case USERMANAGE_LIST:
			{
				renderView =<UserManageList addUser={this.listAddUser.bind(this)}  editUserByType={this.editUser}/>;
				break;
			}
			case USER_ADD_USER:
			{

				renderView = <AddUserInfoPanel ref="admin_modal" data={this.state.data} cancelAddUser={this.cancelAddUser.bind(this)} cancelAddUser={this.cancelAddUser.bind(this)}/>;
				break;
			}

			case USER_EDIT_USER:
			{
				renderView = <EditUserInfoPanel   data={this.state.data} cancelClick={this.cancelAddUser.bind(this)}/>;
				break;
			}

			case USER_RESOUCE_DATA_AUTH:
			{
				renderView = <EditReourceUserInfoPanel   data={this.state.data} cancelClick={this.cancelAddUser.bind(this)}/>;
				break;
			}

			case USER_EDIT_FUN_AUTH:
			{
				renderView = <EditFunUserInfoPanel   data={this.state.data} cancelClick={this.cancelAddUser.bind(this)}/>;
				break;
			}
			case USER_DETAIL_USER:
			{
				renderView = <DetailUserInfoPanel  type="readOnly" data={this.state.data} cancelClick={this.cancelAddUser.bind(this)}/>;
				break;
			}

		}
		return (<div className="owner_user"> {renderView} </div> );
	}
}

module.exports = UserManage;