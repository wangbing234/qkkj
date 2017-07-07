/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 角色主页面
 *
 ***************************************************/
import React from 'react'
import '../../css/index.less'
import RoleListPanel from './RoleListPanel'
import RoleInfoPanel from './RoleInfoPanel'
import RoleDetailPanel from './RoleDetailPanel'
import ReourceEditWin from './authoritypages/ReourceEditWin'
import FunctionEditWin from './authoritypages/FunctionEditWin'
import DataEditWin from './authoritypages/DataEditWin'
import {BreadCrumb} from 'CommonComponent'

let that;
/* render 界面的唯一类型标识 */
const LIST_ADD_ROLE = 'list_add_role';//增加角色
const ROLEMANAGE_LIST = 'rolemanage_list';// 列表
const ROLE_DETAIL_USER = 'role_detail_user';//详情
const ROLE_AUTH = 'Role_auth';// 编辑资源权限
const ROLE_FUN = 'Role_fun';// 编辑功能权
const ROLE_DATA = 'role_data';// 编辑功能权
class RoleManage  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {viewType: ROLEMANAGE_LIST}
    }

    /**
     * 取消编辑
     * @param value
     */
    cancelAddUser(value) {
        that.setState({viewType:ROLEMANAGE_LIST});
    }


    /**
     * 编辑角色
     * @param data
     * @param sign
     * @param e
     */
    editUserByType(data,sign,e){
        that.setState({viewType:sign,data:data});
    }


    render() {
        let renderView;
        that = this;
        switch (that.state.viewType){
            case ROLEMANAGE_LIST://列表
                renderView = <RoleListPanel data={this.state.data}  editUserByType={this.editUserByType}/>;
                break;
            case LIST_ADD_ROLE://增加
                renderView = <RoleInfoPanel ref="superAdmin_modal" data={this.state.data} cancelAddUser={that.cancelAddUser}  editUserByType={this.editUserByType}/>;
                break;
            case ROLE_DETAIL_USER://详情
                renderView = <RoleDetailPanel ref="superAdmin_modal" type="readOnly" data={this.state.data} cancelClick={that.cancelAddUser}/>;
                break;
            case ROLE_AUTH://资源
                renderView = <ReourceEditWin data={this.state.data} editUserByType={this.editUserByType}  cancelClick={that.cancelAddUser}/>;
                break;
            case ROLE_FUN://功能
                renderView = <FunctionEditWin data={this.state.data} editUserByType={this.editUserByType} cancelClick={that.cancelAddUser}/>;
                break;
            case ROLE_DATA://数据
                renderView = <DataEditWin editUserByType={this.editUserByType} data={this.state.data} cancelClick={that.cancelAddUser}/>;
                break;
            default:
                break;
        }
        return (<div className="owner_role"> {renderView}</div>
            );
    }
}

module.exports = RoleManage;