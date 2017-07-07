/***************************************************
 * 时间: 16/6/14 14:15
 * 作者: zhongxia
 * 说明: 版本历史列表
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
//BFD-UI组件库
import DataTable from 'bfd-ui/lib/DataTable'
import DateRange from 'bfd-ui/lib/DatePicker/DateRange'
import confirm from 'bfd-ui/lib/confirm'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
//权限控制
import AuthButton from 'CommonComponent/component/authbutton'
import message from 'CommonComponent/component/bdosmessage'
// 查看脚本
import SeeScript from './SeeScript'
//Ajax 操作
import Model from 'IDERoot/model/versionHistory'

/**
 * 版本历史
 */
class VersionHistory extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      pageNum: 1,
      limit: 10,
      code: prop.code,
      versionHistoryList: {
        totalList: [],
        currentPage: 1,
        totalPageNum: 0
      },
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.getTableData()
  }

  componentWillUnmount() {
    this.ajaxGetVersionHistory && this.ajaxGetVersionHistory.abort();
    this.ajaxRollbackScript && this.ajaxRollbackScript.abort();
  }

  /**
   * 获取表格类
   * @returns {*}
   */
  getColumns() {
    let that = this;
    return [
      {
        title: '版本号',
        key: 'version',
        width:'80px'
      }, {
        title: '提交人',
        key: 'createUser'
      }, {
        title: '提交时间',
        key: 'createTime',
      }, {
        title: '备注',
        key: 'remark'
      }, {
        title: '操作',
        key: 'operation',
        width: '100px',
        render(record) {
          return (
            <span className="myproject-list-opration">
          <AuthButton renderType="a"
                      type="eye"
                      data-code="1021015"
                      style={{marginRight: 15}}
                      href="javascript:void(0);"
                      onClick={that.seeScript.bind(that,record)}>
            查看
          </AuthButton>

          <AuthButton data-code="1021016"
                      renderType="a"
                      type="backward"
                      href="javascript:void(0);"
                      onClick={that.rollback.bind(that,record)}>
            回滚
          </AuthButton>
        </span>
          );
        }
      }
    ]

  }

  /**
   * 查询
   */
  search() {
    this.getTableData()
  }

  /**
   * 回滚脚本
   * @param record
   */
  rollback(record) {
    confirm('确定回滚?', () => {
      this.ajaxRollbackScript = Model.rollbackScript({
        taskCode: record.taskCode,
        version: record.version
      }, function (result) {
        message.success('回滚脚本成功!')
      })
    })
  }

  /**
   * 查看脚本内容
   * @param record
   */
  seeScript(record) {
    //脚本code
    this.setState({scriptData: record})
    this.refs.modal.open();
  }

  /**
   * 获取版本历史数据
   * @param startTime
   * @param endTime
   */
  getTableData(code, currentPage, startTime, endTime) {
    this.ajaxGetVersionHistory = Model.getVersionHistory({
      startTime: startTime || this.state.startTime,
      endTime: endTime || this.state.endTime,
      taskCode: code || this.state.code,
      pageNum: currentPage || this.state.pageNum,
      limit: this.state.limit
    }, (result) => {
      this.setState({versionHistoryList: result.data})
    })
  }

  /**
   * 时间选择事件
   * @param start
   * @param end
   */
  handleSelect(start, end) {
    let startTime = start ? new Date(start).format("yyyy-MM-dd") : '';
    let endTime = end ? new Date(end).format("yyyy-MM-dd") : '';
    this.setState({startTime: startTime, endTime: endTime})
  }

  /**
   * 表格翻页
   */
  onPageChange(currentPage) {
    this.setState({pageNum: currentPage})
    this.getTableData(this.state.code, currentPage, this.state.startTime, this.state.endTime);
  }

  render() {
    return (
      <div className="module-container ide-version-history" style={{display:this.props.display,margin:0,padding:0}}>
        <div className="module-search">
          <DateRange onSelect={this.handleSelect}/>
          <button style={{marginLeft:15}} className="btn btn-sm btn-primary" onClick={this.search}>查询
          </button>
        </div>

        <div className="bdos-table" style={{margin:'15px 0'}}>
          <DataTable column={this.getColumns()} showPage="true" howRow={this.state.limit}
                     data={this.state.versionHistoryList}
                     onPageChange={this.onPageChange}/>
        </div>

        <button
          className="btn btn-sm btn-default"
          onClick={this.props.backToList}>返回
        </button>

        <Modal ref="modal" lock={true}>
          <ModalHeader>
            <h4 className="modal-title">查看脚本</h4>
          </ModalHeader>
          <SeeScript parent={this} data={this.state.scriptData}/>
        </Modal>
      </div>
    );
  }
}

export default VersionHistory