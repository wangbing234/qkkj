/****************************************************
 * create by qing.feng
 * time 2016/7/21 18:16
 * desc：工作流维护-列表界面
 *****************************************************/
import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import confirm from 'bfd-ui/lib/confirm'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import message from 'CommonComponent/component/bdosmessage'
import AuthButton from 'CommonComponent/component/authbutton'
import IconButton from 'CommonComponent/component/iconbutton'

import DefineTimePanel from './pop/DefineTimePanel'
import ExportPanel from './pop/ExportPanel'
import RunConfigPanel from './pop/RunConfigPanel'
import ImportPanel from './pop/ImportPanel'
import AjaxReq from './ajax/AjaxReq'

class ProtectList extends React.Component {
  constructor( props ) {
    super( props );
    this.pageSize = 10;
    this.currentPage = 1;
    this.selectList = [];
    this.tenantryList = [
      { key: "", name: "全部" },
      { key: "0", name: "未上线" },
      { key: "1", name: "已上线" },
      { key: "2", name: "已下线" }
    ];
    this.state = {
      selected: "",
      resourceName: "",
      data: {
        totalList: [], //表格数据
        "currentPage": 1,//当前页
        "totalPageNum": 500//总页数

      }
    };
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*获取定时信息，并弹出窗口*/
  setTimeHandle( taskData ) {
    AjaxReq.getTimerInfo( { projectId: window.projectId, processId: taskData.key }, ( data ) => {
      let isNew = data.data ? false : true;
      this.refs.defineTimePanel.open( { data: data.data ? data.data : {}, isNew: isNew }, taskData );
    } );
  }

  /*状态下拉框切换事件处理*/
  typeHandleChange( value ) {
    this.setState( { ...this.state, selected: value } );
  }

  /*导入点击处理*/
  importHandle() {
    //先校验是否有上传权限。
    this.refs.importPanel.open();
  }

  /*导出按钮点击处理*/
  exportHandle() {
    this.refs.exportPanel.open();
  }

  /*发布按钮点击处理*/
  releaseHandle() {
    let that = this;
    if ( this.selectList && this.selectList.length > 0 ) {
      AjaxReq.releaseWorkFlow( {
        projectId: window.projectId,
        processKeys: this.selectList.join(),
      }, ( data ) => {
        message.success( "发布成功" );
        that.getList();
      } );
    } else {
      message.danger( "请选择要发布的工作流" );
    }
  }

  /*删除点击处理*/
  deleteHandle() {
    let that = this;
    confirm( '确认删除吗？', () => {
      let param = { projectId: window.projectId, processKeys: that.selectList.join( "," ) };
      AjaxReq.deleteWorkflow( param, ( data )=> {
        message.success( "删除成功" );
        that.selectList = [];
        that.getList();
      } );
    } )
  }

  /*翻页处理*/
  onPageChange( page ) {
    this.currentPage = page;
    this.getList();
  }

  /*查询按钮点击处理*/
  searchHandler() {
    this.currentPage = 1;
    this.getList();
  }

  /*工作流名称input输入chang处理*/
  handleChange( evt ) {
    this.setState( { resourceName: evt.target.value } );
  }

  /*获取工作流管理列表数据*/
  getList() {
    let that = this;
    let param = {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      projectId: window.projectId,
      processKey: this.state.resourceName,
      flowState: this.state.selected
    };
    AjaxReq.getProjectList( param, ( data ) => {
      if ( that.loadInterval ) {
        that.selectList = [];
        that.setState( { data: data.data } );
      }
    } );
  }

  /*点击启动按钮-弹出参数填写框*/
  startHandle( data ) {
    this.refs.runConfigPanel.open( data );
  }

  /*复选框change 处理*/
  handleCheckboxSelect( selectItems ) {
    this.selectList = [];
    selectItems.map( ( item ) => {
      this.selectList.push( item.key );
    } );
    //this.selectList = selectItems;
    this.setState( { ...this.state } );
  }

  /*启动窗口运行处理*/
  runHandle( params, item ) {
    let param = {
      projectId: window.projectId,
      key: item.key,
      params: params
    };
    AjaxReq.startWorkflow( param, ( data )=> {
      message.success( "启动成功" );
    } )
  }

  /*下线处理*/
  offLineHandle( item ) {
    let that = this;
    confirm( '确认下线吗？', () => {
      AjaxReq.deleteTimerInfo( { projectId: window.projectId, processKey: item.key }, ( data ) => {
        message.success( "下线成功" );
        that.getList();
      } );
    } )
  }

  /*通知主入口，切换到查看历史版本界面*/
  changeToHistory( item ) {
    this.props.openHistory( item.key );
  }

  /*解锁点击处理*/
  unlock( item, isDisabled ) {
    if ( isDisabled ) return;
    let that = this;
    AjaxReq.lockTask( {
      projectId: window.projectId,
      defId: item.id,
      isLock: 0
    }, ( data ) => {
      message.success( "解锁成功" );
      that.getList();
    } );
  }

  /*跳转到工作流新增界面*/
  addWorkflow() {
    let url = `${Server.workflowUrl}ActiviEditer.html?projectId=${window.projectId}&projectCode=${window.projectCode}&projectName=${window.projectName}`
    window.open( url )
  }

  /*表格-编辑点击，跳转到工作流编辑界面*/
  editHandle( item, isLook ) {
    let url = `${Server.workflowUrl}ActiviEditer.html?projectId=${window.projectId}&key=${item.key}&projectCode=${window.projectCode}&projectName=${window.projectName}`
    if ( isLook ) {
      url += "&flag=1";
    }
    window.open( url )
  }

  /*设置表格列*/
  getTableColumn() {
    let that = this;
    return [
      {
        title: '序号',
        key: 'sequence',
        width:'50px'
      }, {
        title: '工作流编码',
        key: 'key',
        render( text ){
          return (
            <TextOverflow>
              <p style={{maxWidth: "100px",margin:"0px"}}>{text}</p>
            </TextOverflow>
          )
        }
      },
      {
        title: '工作流名称',
        key: 'name',
        render( text, item ){
          return <TextOverflow>
            <div style={{maxWidth: "100px"}}>
              <a href="javascript:void(0);" onClick={that.editHandle.bind(that,item,true)}>{text}</a>
            </div>
          </TextOverflow>
        }
      }, {
        title: '当前锁定者',
        key: 'lockUser'
      }, {
        title: '创建人',
        key: 'createUser',
      }, {
        title: '状态',
        key: 'flowState',
        render( text, item ){
          return that.tenantryList.map( ( tItem ) => {
            if ( tItem.key == text ) {
              return tItem.name;
            }
          } );
        }
      }, {
        title: '调度计划',
        key: 'jobPlan'
      }, {
        title: '更新时间',
        key: 'updateTime',
        render( text, item ){
          return text ? new Date( Number( text ) ).format( "yyyy-MM-dd hh:mm:ss" ) : "";
        }
      }, {
        title: "当前版本",
        key: "maxVersion"
      },
      {
        title: '操作',
        key: 'operation',
        width: "220px",
        render( item, component ) {
          let isOffLine = item.flowState == "1" ? true : false;
          let offLine = null;
          if ( isOffLine ) {
            offLine = (<AuthButton
              renderType="a"
              data-code="1021511"
              onClick={that.offLineHandle.bind(that,item)}
              title="下线">下线</AuthButton>)
          }

          let hasLocker = item.lockUser ? true : false;
          let hasAuthority = item.unLockUser.indexOf( window._currentUser.userName ) != -1 ? true : false;
          let unLockDisabled = hasLocker && hasAuthority ? false : true;
          let setTimeDisabled = item.maxVersion?false:true;
          return (
            <div>
              <AuthButton
                renderType="a"
                data-code="1021506"
                onClick={that.editHandle.bind(that,item,false)}
                title="编辑">编辑</AuthButton>
              <AuthButton
                renderType="a"
                data-code="1021507"
                onClick={that.startHandle.bind(that,item)}
                title="启动">启动</AuthButton>
              <AuthButton
                renderType="a"
                data-code="1021508"
                disabled={setTimeDisabled}
                onClick={that.setTimeHandle.bind(that,item)}
                title="定时">定时</AuthButton>
              {offLine}
              <AuthButton
                renderType="a"
                disabled={setTimeDisabled}
                onClick={that.changeToHistory.bind(that,item)}
                title="历史版本">历史版本</AuthButton>
              <AuthButton
                renderType="a"
                disabled={unLockDisabled}
                onClick={that.unlock.bind(that,item,unLockDisabled)} title="解锁">解锁</AuthButton>
            </div>
          );
        }
      } ]
  }

  render() {
    let disabledDelete = this.selectList && this.selectList.length > 0 ? false : true;
    let column = this.getTableColumn();
    return (<div className="module-container">
      <div className="module-search">
        <IconButton
          renderType="icon"
          type="plus-square"
          data-code="1021502"
          onClick={this.addWorkflow}>新增
        </IconButton>
        <IconButton
          renderType="icon"
          type="trash"
          data-code="1021514"
          disabled={disabledDelete}
          onClick={this.deleteHandle.bind(this)}>
          删除
        </IconButton>
        <IconButton
          renderType="icon"
          type="reply"
          data-code="1021503"
          onClick={this.importHandle.bind(this)}>
          导入
        </IconButton>
        <IconButton
          renderType="icon"
          type="share"
          onClick={this.exportHandle.bind(this)}>
          导出
        </IconButton>
        <IconButton
          renderType="icon"
          type="external-link"
          data-code="1021505"
          disabled={disabledDelete}
          onClick={this.releaseHandle.bind(this)}>发布</IconButton>

        <button
          className="btn btn-sm btn-primary"
          style={{marginLeft:"10px",float:"right"}}
          onClick={this.searchHandler.bind(this)}> 查询
        </button>
        <Select
          defaultValue="0" value={this.state.selected}
          onChange={this.typeHandleChange.bind(this)}
          style={{width:"200px",float:"right"}}>
          {this.tenantryList.map((item,index) => {
            return <Option key={index} value={item.key}>{item.name}</Option>
            })}
        </Select>
        <RestrictInput
          type="text" className="form-control common-input" placeholder="请输入工作流编码或名称"
          style={{float:"right"}} value={this.state.resourceName}
          onChange={this.handleChange.bind(this)} restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE}/>
      </div>
      <div className="module-table">
        <div className="last-td-div checkbox-table">
          <DataTable
            column={column} howRow={this.pageSize} data={this.state.data}
            onPageChange={this.onPageChange.bind(this)} showPage="true"
            onCheckboxSelect={this.handleCheckboxSelect.bind(this)}/>
        </div>
      </div>
      <DefineTimePanel ref="defineTimePanel" refreshList={this.getList.bind(this)}/>
      <ExportPanel ref="exportPanel" selectItems={this.selectList}/>
      <RunConfigPanel ref="runConfigPanel" runHandle={this.runHandle.bind(this)}/>
      <ImportPanel ref="importPanel"/>
    </div>);
  }
}
export default ProtectList