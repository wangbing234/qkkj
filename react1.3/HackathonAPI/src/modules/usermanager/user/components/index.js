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

import AddUser from './AddUser'

import Model from 'model/userManager'

let that;
const columns = [
  {
    title: '用户名',
    key: 'userName'
  }, {
    title: '状态',
    key: 'status',
    render(text, item){
      return text === 0 ? "启用" : '禁用';
    }
  }, {
    title: '应用程序密钥',
    key: 'appSecret',
    width: '260px'
  }, {
    title: '创建时间',
    key: 'createTime',
  }, {
    title: '更新时间',
    key: 'updateTime'
  }, {
    title: '操作',
    key: 'operation',
    render(item) {
      let jsx = (<a href="javascript:void(0);" style={{marginLeft:15}}
                    onClick={that.forbiddenUser.bind(that,item)}>禁用</a>)
      if (item.status === 1) {
        jsx = (<a href="javascript:void(0);" style={{marginLeft:15}}
                  onClick={that.forbiddenUser.bind(that,item)}>启用</a>)
      }
      return (
        <span className="myproject-list-opration">
          <a href="javascript:void(0);"
             onClick={that.editUser.bind(that,item)}>编辑</a>
          {jsx}
          <a href="javascript:void(0);" style={{marginLeft:15,display:'none'}}
             onClick={that.resetPsw.bind(that,item)}>重置密码</a>
          <a href="javascript:void(0);" style={{marginLeft:15}}
             onClick={that.delUser.bind(that,item)}>删除</a>
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
      tbData: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      },
      pageSize: 10,
      currentPage: 1,
      isAddUserPage: false   //是否为添加用户页面
    };
  }

  componentDidMount() {
    this.getUser()
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
   * @param userName 用户名
   */
  getUser(userName, currentPage) {
    Model.getUser({
      userName: userName,
      pageSize: that.state.pageSize,
      currentPage: currentPage || that.state.currentPage
    }, function (result) {
      that && that.setState({tbData: result.data})
    })
  }

  /**
   * 查询
   */
  search() {
    that.getUser(that.state.userName)
  }

  /**
   * 创建用户
   */
  create() {
    that.setState({isAddUserPage: true, UserData: {}})
  }

  /**
   * 编辑用户
   */
  editUser(item) {
    that.setState({UserData: item, isAddUserPage: true})
  }

  /**
   * 禁用用户
   */
  forbiddenUser(item) {
    item.status = item.status === 0 ? 1 : 0;
    Model.updateUser({...item}, function (result) {
      console.log("禁用", result)
      that.getUser()
    })
  }

  /**
   * 重置密码
   */
  resetPsw(item) {

  }

  /**
   * 删除用户
   */
  delUser(item) {
    confirm('确定删除用户?', () => {
      Model.delUser(item.id, function (result) {
        console.log("删除用户", result)
        message.success("删除用户成功!")
        that.getUser()
      })
    })
  }

  /**
   * 表格翻页
   */
  onPageChange(currentPage) {
    that.setState({currentPage: currentPage})
    that.getUser(that.state.userName, currentPage);
  }

  /**
   * 渲染表格列表
   * @returns {XML}
   */
  renderTable() {
    return (
      <div className="module-container" style={{display:this.props.display}}>
        <div className="row" style={{marginBottom:10}}>
          <div className="module-btns  col-sm-6" style={{margin:0}}>
            <button className="btn btn-sm btn-primary"
                    onClick={this.create.bind(this)}>新增用户
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
                   value={this.state.userName}
                   onChange={this.handleChange.bind(this,'userName')}/>
          </div>
        </div>

        <div className="module-table list-container" style={{marginTop:0}}>
          <DataTable column={columns} showPage="true"
                     howRow={10}
                     onPageChange={this.onPageChange.bind(this)}
                     data={this.state.tbData}/>
        </div>
      </div>)
  }

  /**
   * 渲染添加用户/编辑用户页面
   * @returns {XML}
   */
  renderAddUser() {
    return (<AddUser parent={that} data={that.state.UserData}/>)
  }


  render() {
    that = this;
    let jsx = that.renderTable();
    if (that.state.isAddUserPage) {
      jsx = that.renderAddUser()
    }
    return (
      <div>
        {jsx}
      </div>
    )
  }
}

export default UdfManage