/****************************************************
 * create by qing.feng
 * time 2016/7/31 14:47
 * desc：稽核任务列表界面
 *****************************************************/
import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
/*公用组件*/
import message from 'CommonComponent/component/bdosmessage'
import IconButton from 'CommonComponent/component/iconbutton'
import RestrictInput from 'CommonComponent/component/restrictinput'
import AuthButton from 'CommonComponent/component/authbutton'

import RunConfigPanel from './pops/RunConfigPanel'
import ExcuteTip from './pops/ExcuteTip'
import AjaxReq from '../ajax/AjaxReq'

const STATUS_RUN = 0;//是否是运行状态

const IS_ENABLED = 0;//是否是禁用，0是禁用，1是启用

class TaskList extends React.Component {
  constructor( props ) {
    super( props );
    this.pageSize = 10;
    this.currentPage = 1;
    this.selectedItems = [];
    this.state = {
      data: {
        totalList: [],
        "currentPage": 1,
        "totalPageNum": 0
      }
    }
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getTaskList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*表格-报警组-显示处理*/
  getAlertGroupText( item ) {
    let str = "";
    if ( item.messages ) {
      item.messages.map( ( item, index ) => {
        if ( str ) {
          str += ',';
        }
        str += item.groupType == 0 ? "邮件组:" : "短信组:";
        str += item.groupName;
      } );
    }
    return str;
  }

  /*查询*/
  search() {
    this.currentPage = 1;
    this.getTaskList();
  }

  /*获取任务列表*/
  getTaskList() {
    let obj = {
      projectCode: window.projectCode,
      taskName: this.state.taskName,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    };
    let that = this;
    AjaxReq.getTaskList( obj, ( data ) => {
      if ( that.loadInterval ) {
        that.selectedItems = [];
        that.setState( { data: data.data } );
      }
    } );
  }

  /*表格-任务名称点击事件处理- 打开任务详情界面*/
  taskDescHandler( item ) {
    this.props.taskDescHandler( item );
  }

  /*表格-操作-规则配置点击事件处理- 打开规则配置界面*/
  ruleEditHandler( item ) {
    this.props.openRuleConfig( item );
  }

  /*弹出运行界面*/
  openRunHandler( item ) {
    this.refs.runConfigPanel.open( item );
  }

  /*表格-操作-运行点击事件处理*/
  runSubmit( params, item ) {
    let that = this;
    AjaxReq.excuteTask( { id: item.id, ...params }, ( data ) => {
      //1 正在执行
      if ( data.data == "1" ) {
        this.refs.excuteTip.open( item, true );
      } else {//0 执行成功
        message.success( "执行成功" );
        that.getTaskList();
      }
    } );
  }

  /*表格-操作-结束点击事件处理*/
  stopHandler( item ) {
    AjaxReq.stopTask( { id: item.id }, ( data ) => {
      item.status = STATUS_RUN;
      this.setState( {} );
    } );
  }

  /*表格-操作-结束点击事件处理*/
  editClick( item ) {
    this.props.editClick( item );
  }

  /*表格-操作-查看结果点击事件处理*/
  searchResultHandler( item ) {
    this.props.openResultPanel( item );
  }

  /*删除任务 处理*/
  deleteClick() {
    let that = this;
    confirm( '确认删除吗', () => {
      AjaxReq.deleteTask( { ids: that.selectedItems.join( "," ) }, ( data ) => {
        message.success( "删除成功" );
        that.getTaskList();
      } );
    } )
  }

  /*页码change 处理*/
  onPageChange( pageNum ) {
    this.currentPage = pageNum;
    this.getTaskList();
  }


  /*表格checkbox选择*/
  handleCheckboxSelect( selectedRows ) {
    this.selectedItems = [];
    let that = this;
    selectedRows.map( ( item, index ) => {
      that.selectedItems.push( item.id );
    } );
    this.setState( { ...this.state } );
  }

  /*查询输入框change事件处理，将数据写入state*/
  taskChange( evt ) {
    this.setState( { taskName: evt.target.value } );
  }

  /*新增点击处理*/
  addNewTask() {
    this.props.addNew( {} );
  }

  /*表格-列 初始化*/
  getColumn() {
    const that = this;
    return [
      {
        title: '序号',
        key: 'sequence',
        width: '50px'
      }, {
        title: '任务名称',
        key: 'taskName',
        render( text, item ) {
          //data-key={ }
          let _view = <TextOverflow>
            <div style={{maxWidth: "100px"}}>
              <AuthButton
                renderType="a"
                onClick={that.taskDescHandler.bind(that,item)}>
                {text}
              </AuthButton>
            </div>
          </TextOverflow>
          return _view ? _view : text;
        }
      }, {
        title: '任务描述',
        key: 'taskDesc',
        render( text ){
          return <TextOverflow>
            <div style={{maxWidth: "100px"}}>{text}</div>
          </TextOverflow>
        }
      }, {
        title: '规则数',
        key: 'ruleNum',
        width: "60px"
      }, {
        title: '创建时间',
        key: 'createTime',
        width: "160px",
        render( text ){
          return text ? new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ) : "";
        }
      }, {
        title: '更新时间',
        key: 'updateTime',
        width: "160px",
        render( text ){
          return text ? new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ) : "";
        }
      }, {
        title: '创建人',
        key: 'createUser',
        width: '100px'
      }, {
        title: '报警组',
        key: 'messages',
        render( text, item ){
          return <TextOverflow>
            <div className="table-column-max-width">{that.getAlertGroupText( item )}</div>
          </TextOverflow>
        }
      }, {
        title: '操作',
        key: 'operation',
        width: "200px",
        render( item, text ) {
          let statusStr = item.status == STATUS_RUN ? "运行" : "运行中";
          let stopA = item.status == STATUS_RUN ? null :
            <AuthButton
              renderType="a"
              data-code="1021209"
              onClick={that.stopHandler.bind(that,item)} title="结束">结束</AuthButton>
          let statusDisabled = item.status == STATUS_RUN ? false : true;
          return (<div>
            <AuthButton
              renderType="a"
              data-code="1021206"
              onClick={that.ruleEditHandler.bind(that,item)} title="规则配置">规则配置</AuthButton>
            <AuthButton
              data-code="1021205"
              renderType="a"
              onClick={that.editClick.bind(that,item)} title="编辑">编辑</AuthButton>
            <AuthButton
              renderType="a"
              data-code="1021207"
              onClick={that.openRunHandler.bind(that,item)} title={statusStr}>{statusStr}</AuthButton>
            <AuthButton
              renderType="a"
              onClick={that.searchResultHandler.bind(that,item)} title="查看结果">查看结果</AuthButton>
          </div>);
        }
      } ];
  }

  render() {
    let column = this.getColumn();
    let disabledDelete = this.selectedItems && this.selectedItems.length > 0 ? false : true;
    return (
      <div className="module-container">
        <div className="module-search">
          <IconButton
            data-code="1021202" renderType="icon"
            type="plus-square" onClick={this.addNewTask.bind(this)}>新增</IconButton>
          <IconButton
            data-code="1020104" renderType="icon"
            disabled={disabledDelete} type="trash"
            onClick={this.deleteClick.bind(this)}>删除</IconButton>
          <button
            className="btn btn-sm btn-primary module-search-right"
            onClick={this.search.bind(this)}>查询
          </button>
          <RestrictInput
            className="form-control common-input module-search-right"
            placeholder="输入任务名称"
            value={this.state.taskName}
            onChange={this.taskChange.bind(this)}></RestrictInput>
        </div>
        <div className="module-table checkbox-table">
          <DataTable
            data={this.state.data} showPage="true"
            column={column} howRow={this.pageSize}
            onPageChange={this.onPageChange.bind(this)}
            onCheckboxSelect={this.handleCheckboxSelect.bind(this)}
          ></DataTable>
        </div>
        <RunConfigPanel ref="runConfigPanel" runHandle={this.runSubmit.bind(this)}/>
        <ExcuteTip ref="excuteTip" backToList={this.getTaskList.bind(this)}/>
      </div>
    )
  }
}

export default TaskList;
