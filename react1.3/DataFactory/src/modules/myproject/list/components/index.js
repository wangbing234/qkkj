/****************************************************
 * create by qing.feng
 * time 2016/7/21 18:52
 * desc：我的工作台-列表
 *****************************************************/
import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import DataTable from 'bfd-ui/lib/DataTable'
import { Checkbox } from 'bfd-ui/lib/Checkbox'
import confirm from 'bfd-ui/lib/confirm'
import Icon from 'bfd-ui/lib/Icon'
import message from 'CommonComponent/component/bdosmessage'
import AuthButton from 'CommonComponent/component/authbutton'
import IconButton from 'CommonComponent/component/iconbutton'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import loading from 'CommonComponent/component/loading'

import EventName from '../../../../containers/EventName'
import CreateProject from './pops/createProject'
import AjaxReq from '../../ajax/AjaxReq'
import "../../css/style.less"

const MyProject = React.createClass( {
  getInitialState() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.selectList = [];
    return {
      data: { totalList: [] }
    }
  },

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getList(), 100 );
  },

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  },

  /**新增项目**/
  addHandler() {
    this.refs.createProjectModal.open(true);
    this.refs.createProjectModal.setData( {
      title: '新建项目',
      data: {}
    } )
  },

  /**编辑项目**/
  tbEditClick( obj ) {
    AjaxReq.getProjectInfo( { code: obj.code }, this.openProjectEdit );
  },

  /*编辑项目写数据*/
  openProjectEdit( data ){
    data = data.data;
    this.refs.createProjectModal.open(false);
    this.refs.createProjectModal.setData( {
      title: '编辑项目',
      data: data
    } )
  },

  /*删除接口*/
  popDelete( item ){
    let that = this;
    confirm( '确认删除吗？', () => {
      //let param = { codes: that.selectList };
      let param = { codes: [item.code] };
      AjaxReq.deleteProject( param, ( data )=> {
        message.success( "删除成功" );
        //that.selectList = [];
        that.getList();
      } );
    } )
  },

  /*进入到项目管理*/
  enterHomePage( item ) {
    loading.show(true);
    this.setProjectProperties( item );
    let tabData = {
      href: `/myworkbench/chartlist`,
      name: window.projectName,
      icon: "desktop",
      ref: "homePageNav",
      parentNodeRef: "homePageNav"
    };
    this.gotoUrl( tabData );

   /* window.showDefault = true;
    this.setProjectProperties( item );
    EventEmitter.dispatch( EventName.enterHomePage );*/
  },

  setProjectProperties( item ){
    window.projectCode = item.code;
    window.projectId = item.id;//35379;//item.id;
    window.projectName = item.cnName;
  },

  /*页码更换查询*/
  onPageChange( cpage ){
    this.currentPage = cpage;
    this.getList();
  },

  /*当点击查询的时候 始终从第一页开始查询*/
  searchHandler(){
    this.currentPage = 1;
    this.getList();
  },

  /*获取列表接口调用*/
  getList(){
    let param = {
      name: this.state.projectName,
      pageNum: this.currentPage,
      limit: this.pageSize
    };
    AjaxReq.getProjectList( param, this.resultHandler )
  },

  /*查询列表返回结果处理*/
  resultHandler( data ){
    //message.success(data.msg);
    if ( this.loadInterval ) {
      data = data.data;
      this.setState( { data: data } );
    }
  },

  /*复选框change 处理*/
  handleCheckboxSelect( selectItems ) {
    this.selectList = [];
    selectItems.map( ( item, index ) => {
      this.selectList.push( item.code );
    } );
    this.setState( { ...this.state } );
  },

  /*项目名称change的处理*/
  projectChange( evt ){
    this.setState( { projectName: evt.target.value } );
  },

  /*跳转到工作流监控界面*/
  gotoWorkflowMonitor( item ){
    this.setProjectProperties( item );
    let tabData = {
      href: `/workflow/workflowMonitor`,
      name: "工作流监控",
      icon: "gears",
      ref: "workflowMonitorNav",
      parentNodeRef: "workflowNav"
    };
    this.gotoUrl( tabData );
  },

  /*跳转到数据稽核界面*/
  gotoDataAudit( item ){
    this.setProjectProperties( item );
    let tabData = {
      href: `/dataaudit/report`,
      name: "稽核报告",
      icon: "bold",
      ref: "dataAuditReportNav",
      parentNodeRef: "dataAuditNav"
    };
    this.gotoUrl( tabData );
  },

  /*跳转到指定navItem*/
  gotoUrl( hrefData ){
    window.showDefault = false;
    this.props.history.pushState( null, hrefData.href );
    EventEmitter.dispatch( EventName.enterTab, hrefData )
  },

  /*设置表格的显示列*/
  getColumn(){
    let that = this;
    return [
      {
        title:'序号',
        key:'sequence',
        width:'50px'
      },{
      title: '项目编码',
      key: 'enName',
      render( text, item ) {
        return <a href="javascript:void(0);" onClick={that.enterHomePage.bind(that,item)}
                  style={{paddingLeft:5}}>{text}</a>
      }
    }, {
      title: '项目名称',
      key: 'cnName',
      width:'200px'
    }, {
      title: '所属租户',
      key: 'tenantName'
    }, {
      title: '创建人',
      key: 'createUser'
    }, {
      title: '创建时间',
      key: 'createTime',
      render( text ){
        return text ? (new Date( Number( text ) )).format( "yyyy-MM-dd hh:mm:ss" ) : "";
      }
    }, {
      title: '异常稽核任务数',
      key: 'taskErrorCount',
      render( text, item ){
        return <AuthButton
          renderType="a"
          data-code="10213"
          href="javascript:void(0);"
          style={{color:"#ff0000"}}
          onClick={that.gotoDataAudit.bind(that,item)}>{text}</AuthButton>
      }
    }, {
      title: '失败工作流数',
      key: 'errorWorkFlowNum',
      render( text, item ){
        let _view = <AuthButton
          renderType="a"
          data-code="10216"
          href="javascript:void(0);"
          style={{color:"#ff0000"}}
          onClick={that.gotoWorkflowMonitor.bind(that,item)}>{text}</AuthButton>;
        return _view ? _view : <span style={{color:"#ff0000"}}>{text}</span>;
      }
    }, {
      title: '数据表个数',
      key: 'tableCount'
    }, {
      title: '操作',
      key: 'operation',
      width: "60px",
      render( record, text ) {
        return (
          <div>
            <AuthButton
              renderType="a"
              data-code="1020103"
              onClick={that.tbEditClick.bind(that,record)}
              title="编辑">编辑</AuthButton>
            <AuthButton
              renderType="a"
              data-code="1020104"
              onClick={that.popDelete.bind(that,record)}
              title="删除">删除</AuthButton>
          </div>

      )
      }
    } ];
  },

  render() {
    let column = this.getColumn();
    let userType = CommonUtil.getCurrentUserType();
    let addBtn;
    if([BFD.ENUM.UserType.SUPERADMIN,BFD.ENUM.UserType.ADMIN].indexOf(userType) == -1){
      addBtn = <IconButton
        data-code="1020102" renderType="icon"
        type="plus-square" onClick={this.addHandler}>新增</IconButton>;
    }
    //let disabledDelete = this.selectList && this.selectList.length > 0 ? false : true;
    return (<div className="module-container myproject">
      <span><h2 style={{marginBottom:"15px",color: "#666666"}}>我的工作台</h2></span>
      <div className="module-search">
        {addBtn}
        {/*<IconButton
          data-code="1020104" renderType="icon"
          disabled={disabledDelete} type="trash"
          onClick={this.popDelete}>删除</IconButton>*/}
        <button
          className="btn btn-sm btn-primary module-search-right"
          onClick={this.searchHandler}>查询</button>
        <RestrictInput
          className="form-control common-input module-search-right"
          placeholder="输入项目名称或编码"
          restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_24}
          value={this.state.projectName}
          onChange={this.projectChange}
        ></RestrictInput>
      </div>
      <div className="module-table">
        <DataTable
          data={this.state.data} showPage="true" column={column} howRow={this.pageSize}
          onPageChange={this.onPageChange}></DataTable>
      </div>
      {/*新建编辑项目*/}
      <CreateProject ref="createProjectModal" refreshProject={this.getList}/>

    </div>);
  }
} );

export default  MyProject;
