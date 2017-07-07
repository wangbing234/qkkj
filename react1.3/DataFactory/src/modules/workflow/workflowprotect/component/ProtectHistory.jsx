/****************************************************
 * create by qing.feng
 * time 2016/7/21 20:53
 * desc：工作流维护- 查看历史版本
 *****************************************************/
import React from 'react';
import { DateRange } from 'bfd-ui/lib/DatePicker'
import DataTable from 'bfd-ui/lib/DataTable'
import message from 'CommonComponent/component/bdosmessage'
import AuthButton from 'CommonComponent/component/authbutton'
import AjaxReq from './ajax/AjaxReq'

class ProtectHistory extends React.Component {
  constructor( props ) {
    super( props );
    this.pageSize = 10;
    this.currentPage = 1;
    this.state = {
      data: {
        totalList: [ ], //表格数据
        "currentPage": 1,//当前页
        "totalPageNum": 0//总页数

      }
    };
  }

  /*日期change处理*/
  handleSelect( start, end ) {
    this.setState( { start, end } )
  }

  /*组件实例化时，获取列表数据*/
  componentDidMount() {
    this.getHistoryList();
  }

  /*翻页处理*/
  onPageChange( pageNum ) {
    this.currentPage = pageNum;
    this.getHistoryList();
  }

  /*获取历史版本列表数据*/
  getHistoryList() {
    let that = this;
    AjaxReq.getWorkflowHistoryList( {
      projectId: window.projectId,
      processKey: this.props.projectKey,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
      startTime: this.state.start,
      endTime: this.state.end
    }, ( data ) => {
      that.setState( { data: data.data } );
    } );
  }

  /*查看流程图*/
  lookHandle( item ) {
    /*表格-查看点击，跳转到工作流编辑界面 , flag=1 不显示保存按钮*/
    let _id = item.id.replace(" ","");
    let url = `${Server.workflowUrl}ActiviEditer.html?projectId=${window.projectId}&key=${item.key}&defId=${_id}&projectCode=${window.projectCode}&projectName=${window.projectName}&flag=1`
    window.open( url )
  }

  /*回滚*/
  backHandle( item ) {
    let that = this;
    AjaxReq.rollbackWorkflow( {
      projectId: window.projectId,
      defId: item.id
    }, ( data ) => {
      message.success( "回滚成功" );
      that.getHistoryList();
    } );
  }

  /*设置表格列*/
  getColumn() {
    let that = this;
    return [ {
      title: '版本号',
      key: 'version'
    }, {
      title: '发布人',
      key: 'releaseUser'
    }, {
      title: '发布时间',
      key: 'releaseTime',
      render( text ){
        return new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" );
      }
    }, {
      title: '备注',
      key: 'remark'
    }, {
      title: '操作',
      key: 'operation',
      render( record ) {
        return (<div>
          <AuthButton
            renderType="a"
            onClick={that.lookHandle.bind(that,record)}
            title="查看">查看</AuthButton>
          <AuthButton
            renderType="a"
            data-code="1021513"
            onClick={that.backHandle.bind(that,record)}
            title="回滚">回滚</AuthButton>
        </div>);
      }
    } ]
  }

  render() {
    let columns = this.getColumn();
    return (<div className="module-container">
      <div className="btns-div" style={{height:"30px"}}>
        <button className="btn btn-sm btn-primary" style={{float:"right"}} ref="btn_search" onClick={this.search}>查询
        </button>
        <DateRange style={{float:"right",marginRight:"10px"}} start={this.state.start}
                   onSelect={this.handleSelect.bind(this)}/>
      </div>
      <div className="module-table">
        <DataTable
          column={columns}
          howRow={this.pageSize} data={this.state.data}
          onPageChange={this.onPageChange.bind(this)}
          showPage="true"/>
      </div>
      <button
        className="btn btn-sm btn-default"
        style={{marginTop:"20px"}}
        onClick={this.props.backToList}>返回</button>
    </div>);
  }
}
export default ProtectHistory