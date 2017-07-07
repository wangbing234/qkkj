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

import AddResourceConfig from './AddResourceConfig'

import Model from 'model/resourceConfig'

let that;
const columns = [
  {
    title: '数据源',
    key: 'sourceName'
  }, {
    title: '别名',
    key: 'aliasName'
  }, {
    title: '类型',
    key: 'type',
    render: function (text, item) {
      return text === 0 ? 'mysql' : 'hbase';
    }
  }, {
    title: '创建时间',
    key: 'createTimeStr'
  }, {
    title: '更新时间',
    key: 'updateTimeStr'
  }, {
    title: '操作',
    key: 'operation',
    render(record) {
      return (
        <span className="myproject-list-opration">
          <a href="javascript:void(0);"
             onClick={that.edit.bind(that,record)}>编辑</a>
          <a href="javascript:void(0);" style={{marginLeft:15}}
             onClick={that.del.bind(that,record)}>删除</a>
        </span>
      );
    }
  }
]

/**
 * 资源配置
 */
class ResoureConfig extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      tbData: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      },
      pageSize: 10,
      pageNum: 1,
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
   * @param param 参数
   */
  getTableData(currentPage) {
    let param = param || {}
    param.pageSize = that.state.pageSize;
    param.pageNo = currentPage || that.state.pageNo;

    Model.getTable(param, function (result) {
      that && that.setState({tbData: result.data})
    })
  }

  /**
   * 创建
   */
  create() {
    that.setState({isAddPage: true, ResourceConfigItem: {}})
  }

  /**
   * 编辑
   */
  edit(item) {
    that.setState({ResourceConfigItem: item, isAddPage: true})
  }

  /**
   * 删除,表格操作列
   * 批量删除的时候, item 会为false , 在 删除按钮的 onclick bind 方法传了false
   */
  del(item) {
    let ids = item ? item[that.state.idFiled] : that.state.selectIds;
    if (ids) {
      confirm('确定删除资源配置?', () => {
        Model.del(ids, function (result) {
          console.log("资源配置", result)
          message.success("删除资源配置成功!")
          that.getTableData()
        })
      })
    }
  }

  /**
   * 表格翻页
   */
  onPageChange(currentPage) {
    that.setState({pageNo: currentPage})
    that.getTableData(currentPage);
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
        <div className="module-btns" style={{marginTop:0}}>
          <button className="btn btn-sm btn-primary"
                  onClick={this.create.bind(this)}>新增配置
          </button>
          <button className="btn btn-sm btn-primary"
                  onClick={this.del.bind(this,false)}>删除
          </button>
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
    return (<AddResourceConfig parent={that} data={that.state.ResourceConfigItem}/>)
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