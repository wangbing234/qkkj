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

import AddHbaseApi from './AddHbaseApi'

import Model from 'model/apiManager'

let that;
const columns = [
  {
    title: 'API URL',
    key: 'apiUrl',
    width: '35%',
    render: function (text, item) {
      return (<span title={text}>{text}</span>)
    }
  }, {
    title: '别名',
    key: 'aliasName'
  }, {
    title: '类型',
    key: 'sourceType',
    render: function (text, item) {
      return text === 0 ? 'mysql' : 'hbase'
    }
  }, {
    title: '更新时间',
    key: 'updateTimeStr'
  }, {
    title: '操作',
    key: 'operation',
    render(record) {
      let jsx = (<a href="javascript:void(0);" style={{marginLeft:15}}
                    onClick={that.publish.bind(that,record)}>发布</a>)
      if (record.publish === 1) {
        jsx = (<a href="javascript:void(0);" style={{marginLeft:15}}
                  onClick={that.revoke.bind(that,record)}>撤销</a>)
      }
      return (
        <span className="myproject-list-opration">
          <a href="javascript:void(0);"
             onClick={that.edit.bind(that,record)}>编辑</a>
          {jsx}
          <a href="javascript:void(0);" style={{marginLeft:15}}
             onClick={that.del.bind(that,record)}>删除</a>
        </span>
      );
    }
  }
]

/**
 * 版本历史
 */
class ResoureConfig extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      pageSize: 10,
      pageNo: 1,
      sourceType: 1, //1 表示 hbase
      tbData: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      },
      idFiled: 'id', //表格唯一标识字段
      isAddPage: false,  //是否为添加用户页面
      selectIds: '', //选中行的唯一标识
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
   * @param apiUrl 用户名
   */
  getTableData(apiUrl, currentPage) {
    Model.getTable({
      sourceType: that.state.sourceType,
      apiUrl: apiUrl,
      pageSize: that.state.pageSize,
      pageNo: currentPage || that.state.pageNo,
    }, function (result) {
      that && that.setState({tbData: result.data})
    })
  }

  /**
   * 创建用户
   */
  create() {
    that.setState({isAddPage: true})
  }

  /**
   * 编辑
   */
  edit(item) {
    that.setState({HbaseAPIItem: item, isAddPage: true})
  }

  /**
   * 删除,表格操作列
   * 批量删除的时候, item 会为false , 在 删除按钮的 onclick bind 方法传了false
   */
  del(item) {
    let ids = item ? item[that.state.idFiled] : that.state.selectIds;
    if (ids) {
      confirm('确定删除Hbase API?', () => {
        Model.del(ids, function (result) {
          console.log("删除Hbase API", result)
          message.success("删除Hbase API成功!")
          that.getTableData(that.state.apiUrl, that.state.pageNo)
        })
      })
    }
  }

  /**
   * 发布
   * @param item
   */
  publish(item) {
    Model.pubishAPI(item.id, function () {
      that.getTableData(that.state.apiUrl, that.state.pageNo)
    })
  }

  /**
   * 撤销
   * @param item
   */
  revoke(item) {
    Model.revockAPI(item.id, function () {
      that.getTableData(that.state.apiUrl, that.state.pageNo)
    })
  }

  search() {
    that.getTableData(that.state.apiUrl)
  }

  /**
   * 表格翻页
   */
  onPageChange(currentPage) {
    that.setState({pageNo: currentPage})
    that.getTableData(that.state.apiUrl, currentPage);
  }

  /**
   * 表格多选功能
   * @param selects 数组, 返回选中行
   */
  checkboxSelect(selects) {
    let delIds = '';
    selects && selects.map(function (item, index) {
      delIds += `${item[that.state.idFiled]},`;
    })
    if (delIds.length > 0) {
      delIds = delIds.substr(0, delIds.length - 1);
    }
    console.log("delIds", delIds)
    that.setState({selectIds: delIds})
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
                    onClick={this.create.bind(this)}>新增API
            </button>
            <button className="btn btn-sm btn-primary"
                    onClick={this.del.bind(this,false)}>删除
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
                   value={this.state.apiUrl}
                   onChange={this.handleChange.bind(this,'apiUrl')}/>
          </div>
        </div>

        <div className="module-table table-checkbox" style={{marginTop:0}}>
          <DataTable column={columns}
                     showPage="true"
                     howRow={10}
                     data={this.state.tbData}
                     onPageChange={this.onPageChange.bind(this)}
                     onCheckboxSelect={this.checkboxSelect.bind(this)}/>
        </div>
      </div>)
  }

  /**
   * 渲染添加用户/编辑用户页面
   * @returns {XML}
   */
  renderAddUser() {
    return (<AddHbaseApi parent={that} data={that.state.HbaseAPIItem}/>)
  }


  render() {
    that = this;
    let jsx = that.renderTable();
    if (that.state.isAddPage) {
      jsx = that.renderAddUser()
    }
    return (
      <div>
        {jsx}
      </div>
    )
  }
}

export default ResoureConfig