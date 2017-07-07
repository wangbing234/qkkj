/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 角色列表页面
 *
 ***************************************************/
import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import RoleInfoPanel from './RoleInfoPanel'
import confirm from 'bfd-ui/lib/confirm'
import ChangeOwnerRoleForm from './ChangeOwnerRoleForm'
const ROLE_DETAIL_USER = 'role_detail_user';// 编辑功能权限
const LIST_ADD_ROLE = 'list_add_role';//增加角色
import Ajax from '../ajax/AjaxReq'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import CommonModalWin from 'CommonModalWin'
import BaseRoleForm from './tab/subtab/BaseRoleForm'
import RoleUserInfo from './tab/subtab/RoleUserInfo'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import AuthButton from 'CommonComponent/component/authbutton'
import message from 'CommonComponent/component/bdosmessage'

const ROLE_AUTH = 'Role_auth';// 编辑资源权限
const ROLE_FUN = 'Role_fun';// 编辑功能权
const ROLE_DATA = 'role_data';// 编辑功能权
let that;

class RoleListPanel extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {data: {totalList: []}};
    this.columns = [{
      title: '角色名称', key: 'roleName', render(text, record){
        return (<a href="javascript:void(0);"
                   onClick={that.props.editUserByType.bind(that,record,ROLE_DETAIL_USER)}> {text} </a>);
      }
    },
      {title: '成员', key: 'members'},
      {title: '创建时间', key: 'createTime'},
      {title: '更新时间', key: 'updateTime'},
      {
        title: '操作', key: 'operation', width: '160px', render(text, record){

        let content;
        if (text.roleName == "租户所有者") {
          content = (<div style={{lineHeight:"21x"}}>
              <AuthButton renderType="a" onClick={that.changeOwner.bind(that,text)} title="变更租户所有者">变更租户所有者</AuthButton>
            </div>
          );
        }
        else {
          content = (
            <div style={{lineHeight:"21x"}}>
              <AuthButton renderType="a" type="edit" onClick={that.editOwner.bind(that,text)} title="编辑">编辑</AuthButton>
              <Dropdown style={{verticalAlign:'top'}}>
                <DropdownToggle>
                  <AuthButton renderType="a" title="授权">授权</AuthButton>
                </DropdownToggle>
                <DropdownMenu>
                  <AuthButton renderType="option" onClick={that.props.editUserByType.bind(that,text,ROLE_FUN)}
                              title="功能">功能</AuthButton>
                  <AuthButton renderType="option" onClick={that.props.editUserByType.bind(that,text,ROLE_AUTH)}
                              title="资源">资源</AuthButton>
                  <AuthButton renderType="option" onClick={that.props.editUserByType.bind(that,text,ROLE_DATA)}
                              title="数据">数据</AuthButton>
                </DropdownMenu>
              </Dropdown>
              <AuthButton renderType="a" onClick={that.editManagerUser.bind(that,text)} title="用户">用户</AuthButton>
              <AuthButton data-code="1021002" renderType="a" onClick={that.delHandler.bind(that,text)}
                          title="删除">删除</AuthButton>
            </div>
          );
        }
        return content
      }
      }];
  }

  componentDidMount() {
    that.getDataByUrl(1);
  }

  /**
   * 删除处理
   * @param item
   * @param e
   */
  delHandler(item, e) {
    var info19 = {
      "id": item.id
    };
    confirm('是否删除该条记录?', () => {
      Ajax.deleteRoleList(info19, (data) => {
        that.getDataByUrl(1);
        message.success(data.msg);
      })
    })
  }

  /**
   * 改变租户所有者
   * @param e
   */
  changeOwner(item, e) {

    that.refs._modal.setState(item);
    that.refs._modal.refs._modal.open();
  }

  /**
   * 编辑用户
   * @param item
   * @param e
   */
  editOwner(item, e) {
    that.refs._modalRole.refs._modal.open();
    that.refs._modalRole.setState({data: item})
  }

  /**
   * 用户管理
   * @param item
   * @param e
   */
  editManagerUser(item, e) {
    that.refs._modalUser.setState({...item})
    that.refs._modalUser.refs._modal.open();
  }

  /**
   * 分页修改
   * @param nextPage
   */
  onPageChange(nextPage) {
    that.getDataByUrl(nextPage);
  }

  /**
   * 提交租户
   * @param e
   * @param item
   */
  submitOwenr(item) {
    confirm('变更租户所有者后,需要重新登录系统!', () => {
      let itemUser = item.name.split("###");
      let data = {
        id: itemUser[0],
        oldUserId: window._currentUser.id,
        oldUserName: window._currentUser.userName,
        newUserName: itemUser[1]
      };
      Ajax.changeTenantOwner(data, (result) => {
        that.refs._modal.refs._modal.close();
        window.top.location = '/bdos-logout'
      });
    })
  }

  /**
   * 提交编辑
   * @param item
   * @param e
   */
  submitEdit(item, e) {
    var info13 = {role: item}
    Ajax.editRole(info13, (data) => {
      that.refs._modalRole.refs._modal.close();
      that.getDataByUrl(1);
    })
  }

  /**
   * 提交接口
   * @param item
   * @param e
   */
  submitUser(item) {
    var info13 = {
      "role": item,
      "oldUserNames": CommonUtil.transferObjectArray(item.oldRole, "userName"),
      "newUserNames": CommonUtil.transferObjectArray(item.targetData, "userName")
    }
    Ajax.editRoleAssociateUser(info13, (data) => {
      that.refs._modalUser.refs._modal.close();
      that.getDataByUrl(1);
    })
  }


  /**
   * 获取角色管理用户
   * @param page
   */
  getDataByUrl(page) {
    var info18 = {
      "currentPage": page,
      "pageSize": 15
    };
    Ajax.listByTenant(info18, (data) => {
      that.setState({data: data.data, page});
    })

    //Ajax.editRoleAssociateUser(info13,(data) => {
    //    that.refs._modalUser.refs._modal.close();
    //    that.getDataByUrl(1);
    //})
  }

  render() {
    that = this;
    return (
      <div className="module-container">
        <div className="module-search">
          <button className="btn btn-sm btn-primary" onClick={this.props.editUserByType.bind(that,"",LIST_ADD_ROLE)}>
            新增角色
          </button>
        </div>
        <div className="module-table operatioinTable">
          <DataTable data={this.state.data} column={this.columns} howRow={10} onPageChange={this.onPageChange}
                     showPage="true"/>
        </div>
        <CommonModalWin title="变更租户所有者" ref="_modal" Child={ChangeOwnerRoleForm} submit={this.submitOwenr.bind(this)}/>
        <CommonModalWin title="角色基本信息" ref="_modalRole" Child={BaseRoleForm} submit={this.submitEdit.bind(this)}/>
        <CommonModalWin title="关联用户" ref="_modalUser" Child={RoleUserInfo} submit={this.submitUser.bind(this)}/>
      </div>
    );
  }
}

module.exports = RoleListPanel;