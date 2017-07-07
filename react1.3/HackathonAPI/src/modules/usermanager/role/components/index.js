/***************************************************
 * 时间: 16/6/14 14:15
 * 作者: zhongxia
 * 说明: 数据资源管理[目前不需要做, 产品经理还没有确定]
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
//BFD-UI组件库
import DataTable from 'bfd-ui/lib/DataTable'
import message from 'bfd-ui/lib/message'
import confirm from 'bfd-ui/lib/confirm'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'

import AddRole from './AddRole'
import AuthorizationRole from './AuthorizationRole'
import AddUser from './AddUser'

import Model from 'model/userManager'

let that;
const columns = [
  {
    title: '角色名称',
    key: 'roleName'
  }, {
    title: '创建时间',
    key: 'createTime',
  }, {
    title: '更新时间',
    key: 'updateTime'
  }, {
    title: '操作',
    key: 'operation',
    render(record) {
      return (
        <span className="myproject-list-opration">
          <a href="javascript:void(0);"
             onClick={that.editRole.bind(that,record)}>编辑</a>
          <a href="javascript:void(0);" style={{marginLeft:15}}
             onClick={that.authorizationRole.bind(that,record)}>授权</a>
          <a href="javascript:void(0);" style={{marginLeft:15}}
             onClick={that.addUser.bind(that,record)}>添加用户</a>
          <a href="javascript:void(0);" style={{marginLeft:15}}
             onClick={that.delRole.bind(that,record)}>删除</a>
        </span>
      );
    }
  }
]

/**
 * 版本历史
 */
class UdfManage extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      pageSize: 10,
      currentPage: 1,
      tbData: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      },
      pageIndex: 0   //0 列表页面 1 添加角色, 2 授权  3 添加用户
    };
  }

  componentDidMount() {
    this.getTableData()
  }

  componentWillUnmount() {
    that = null
  }

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  /**
   * 获取表格数据
   * @param roleName 用户名
   */
  getTableData(roleName) {
    Model.getRole({
      roleName: roleName,
      pageSize: that.state.pageSize,
      currentPage: that.state.currentPage
    }, function (result) {
      that && that.setState({tbData: result.data})
    })
  }

  search() {
    that.getTableData(that.state.roleName)
  }

  /**
   * 创建用户
   */
  create() {
    that.setState({pageIndex: 1})
  }

  /**
   * 编辑角色
   */
  editRole(item) {
    that.setState({roleData: item, pageIndex: 1})
  }

  /**
   * 授权角色
   */
  authorizationRole(item) {
    that.setState({authorizationData: item, pageIndex: 2})
  }

  /**
   * 添加用户
   */
  addUser(item) {
    that.setState({userData: item, pageIndex: 3})
  }

  /**
   * 删除角色
   */
  delRole(item) {
    confirm('确定删除角色?', () => {
      Model.delRole(item.id, function (result) {
        console.log("删除角色", result)
        message.success("删除角色成功!")
        that.getTableData(that.state.roleName)
      })
    })
  }

  /**
   * 表格翻页
   */
  onPageChange(currentPage) {
    that.setState({currentPage: currentPage})
    that.getTableRole(that.state.roleName);
  }

  /**
   * 渲染表格列表
   * @returns {XML}
   */
  renderTable() {
    return (<div className="module-container" style={{display:this.props.display}}>
      <div className="row" style={{marginBottom:10}}>
        <div className="module-btns  col-sm-6" style={{margin:0}}>
          <button className="btn btn-sm btn-primary"
                  onClick={this.create.bind(this)}>新增角色
          </button>
        </div>

        <div className="module-search col-sm-6" style={{margin:0,textAlign:'right'}}>
          <button className="btn btn-sm btn-primary"
                  style={{float:'right'}}
                  onClick={this.search}>查询
          </button>
          <input style={{float:'right'}}
                 className="form-control"
                 placeholder="请输入关键字"
                 value={this.state.roleName}
                 onChange={this.handleChange.bind(this,'roleName')}/>
        </div>
      </div>

      <div className="module-table list-container" style={{marginTop:0}}>
        <DataTable column={columns} showPage="true" howRow={10} data={this.state.tbData}
                   onPageChange={this.onPageChange.bind(this)}
        />
      </div>
    </div>)
  }

  /**
   * 渲染添加用户/编辑用户页面
   * @returns {XML}
   */
  renderAddRole() {
    return (<AddRole parent={that} data={that.state.roleData}/>)
  }

  /**
   * 渲染授权页面
   * @returns {XML}
   */
  renderAuthorizationRole() {
    return (<AuthorizationRole parent={that} data={that.state.authorizationData}/>)
  }

  /**
   * 渲染授权页面
   * @returns {XML}
   */
  renderAddUser() {
    return (<AddUser parent={that} data={that.state.userData}/>)
  }

  render() {
    that = this;
    let jsx = that.renderTable();
    switch (that.state.pageIndex) {
      case 0:
        jsx = that.renderTable();
        break;
      case  1:
        jsx = that.renderAddRole();
        break;
      case 2:
        jsx = that.renderAuthorizationRole();
        break;
      case 3:
        jsx = that.renderAddUser();
        break;
    }
    return (
      <div>
        {jsx}
      </div>
    )
  }
}

export default UdfManage