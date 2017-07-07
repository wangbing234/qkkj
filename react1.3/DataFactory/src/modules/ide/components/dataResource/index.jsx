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
import DateRange from 'bfd-ui/lib/DatePicker/DateRange'
import confirm from 'bfd-ui/lib/confirm'
// 查看脚本
import SeeScript from './SeeScript'
//Ajax 操作
import Model from '../../model/versionHistory'

let that;
const columns = [
  {
    title: '资源名称',
    key: 'id'
  }, {
    title: '文件名',
    key: 'submitter'
  }, {
    title: '创建时间',
    key: 'submitTime',
  }, {
    title: '创建人',
    key: 'remark'
  }, {
    title: '操作',
    key: 'operation',
    render(record) {
      return (
        <span className="myproject-list-opration">
          <a href="javascript:void(0);"
             onClick={that.seeScript.bind(that,record)}>编辑</a>
        </span>
      );
    }
  }
]

/**
 * 版本历史
 */
class VersionHistory extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      versionHistoryList: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      }
    };
    this.search = this.search.bind(this)
    this.dateSelect = this.dateSelect.bind(this)
    this.rollback = this.rollback.bind(this)
    this.seeScript = this.seeScript.bind(this)
  }

  componentDidMount() {
    this.getTableData()
  }

  componentWillUnmount() {
    that = null
  }

  /**
   * 获取表格数据
   * @param startTime
   * @param endTime
   */
  getTableData(startTime, endTime) {
    let that = this;
    Model.getVersionHistory(startTime, endTime, function (result) {
      that.setState({versionHistoryList: result.data})
    })
  }

  search() {
    this.getTableData(this.state.startTime, this.state.endTime)
  }

  rollback(record) {
    confirm('确定回滚?', () => {
      Model.rollbackScript(record.id, function (result) {
        message.success('回滚脚本成功!')
      })
    })
  }

  seeScript(record) {
    this.setState({scriptId: record.id, mode: record.mode})
    this.refs.seeScript.refs.modal.open();
  }


  createResource() {

  }

  render() {
    that = this
    return (
      <div className="module-container" style={{display:this.props.display}}>
        <div className="module-search">
          <input style={{display:'inline-block'}}
                 className="form-control"
                 placeholder="按资源名称、文件名查询"/>
          <button style={{marginLeft:15}} className="btn btn-sm btn-primary"
                  onClick={this.search}>查询
          </button>
        </div>

        <div className="module-btns">
          <button className="btn btn-sm btn-primary"
                  onClick={this.createResource}>新增
          </button>
          <button className="btn btn-sm btn-default"
                  onClick={this.search}>删除
          </button>
        </div>

        <div className="module-table list-container" style={{marginTop:0}}>
          <DataTable column={columns} showPage="true" howRow={10} data={this.state.versionHistoryList}/>
        </div>

        <SeeScript ref="seeScript" scriptId={this.state.scriptId} mode={this.state.mode}/>
      </div>
    );
  }
}

export default VersionHistory