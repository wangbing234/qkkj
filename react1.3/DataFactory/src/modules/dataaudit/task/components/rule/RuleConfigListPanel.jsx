import React from 'react';
import DataTable from 'bfd-ui/lib/DataTable'
import confirm from 'bfd-ui/lib/confirm'
import Icon from 'bfd-ui/lib/Icon'
import TextOverflow from 'bfd-ui/lib/TextOverflow'
import { Dropdown, DropdownToggle, DropdownMenu } from 'bfd-ui/lib/Dropdown'
import List from 'CommonComponent/component/list'
import message from 'CommonComponent/component/bdosmessage'
import IconButton from 'CommonComponent/component/iconbutton'
import AuthButton from 'CommonComponent/component/authbutton'
import EditPanel from 'CommonComponent/component/bdoseditpanel'

import RunConfigPanel from './../pops/RunConfigPanel'
import RuleResultPanel from './../pops/RuleResultPanel'
import AjaxReq from '../../ajax/AjaxReq'
import RuleConst from '../../../utils/RuleConst'
import ExcuteTip from '../pops/ExcuteTip'

const STATUS_RUN = 0;//是否是运行状态

const IS_ENABLED = 0;//是否是禁用，0是禁用，1是启用

class RuleConfigPanel extends React.Component {
  constructor( props ) {
    super( props );
    this.pageSize = 10;//每页显示条数
    this.currentPage = 1;//当前页
    this.taskData = this.props.taskData;//当前任务数据
    //初始化state
    this.state = {
      taskName: this.taskData.taskName,
      singleList: [],
      multiList: [],
      tableData: {
        "totalList": [], //表格数据
        "currentPage": 1, //当前页
        "totalPageNum": 500 //总条数
      }
    };
  }

  /*初始化规则表格列*/
  getColumn() {
    const that = this;
    return [
      {
        title: '序号',
        key: 'sequence',
        width:'50px'
      },
      {
        title: '规则名称',
        key: 'ruleName',
        render( text,item ){
          return (
            <TextOverflow>
              <div style={{maxWidth: "200px"}}>
                <a href="javascript:void(0);" onClick={that.taskDescHandler.bind(that,item)}>{text}</a>
              </div>
            </TextOverflow>
          )
        }
      }, {
        title: '状态',
        key: 'enabled',
        width: "60px",
        render( text ){
          return text == IS_ENABLED ? "启用" : "禁用"
        }
      }, {
        title: '规则类型',
        key: 'type',
        width: "180px",
        render( text ){
          return RuleConst.typeDic[ text ];
        }
      }, {
        title: '稽核数据库',
        key: 'sourceDatabase',
        render(text){
          return (
            <TextOverflow>
              <p style={{maxWidth: "150px",margin:"0px"}}>{text}</p>
            </TextOverflow>
          )
        }
      }, {
        title: '稽核表',
        key: 'sourceTable',
        render(text){
          return (
            <TextOverflow>
              <p style={{maxWidth: "150px",margin:"0px"}}>{text}</p>
            </TextOverflow>
          )
        }
      }, {
        title: '操作',
        key: 'operation',
        width: "200px",
        render( item, text ) {
          let runItem = item.enabled == IS_ENABLED ? <AuthButton
            renderType="a"
            onClick={that.runHandler.bind(that,item)} title="运行">运行</AuthButton> : null;
          return (<div>
            <AuthButton
              renderType="a" onClick={that.editClick.bind(that,item,false)} title="编辑">编辑</AuthButton>
            <AuthButton
              renderType="a" onClick={that.editClick.bind(that,item,true)} title="另存为">另存为</AuthButton>
            <AuthButton
              renderType="a"
              onClick={that.disabledHandler.bind(that,item)}
              title={item.enabled == IS_ENABLED?"禁用":"启用"}>{item.enabled == IS_ENABLED?"禁用":"启用"}</AuthButton>
            {runItem}
            <AuthButton
              renderType="a"
              onClick={that.searchResultHandler.bind(that,item)}
              title="查看结果">查看结果</AuthButton>
          </div>);
        }
      } ];
  }

  taskDescHandler( item ) {
    this.props.openEditRuleInfo( item, false, true, false );
  }

  /**删除**/
  deleteHandler() {
    let that = this;
    confirm( '确认删除吗', () => {
      AjaxReq.deleteRules( { ids: that.selectedItems.join( "," ) }, ( data ) => {
        message.success( "删除成功" );
        that.getRuleList();
      } );
    } )
  }

  /*表格-操作-编辑点击事件处理*/
  editClick( item, isSaveAs ) {
    this.props.openEditRuleInfo( item, false, false, isSaveAs );
  }

  /*表格-操作-禁用点击事件处理*/
  disabledHandler( item ) {
    let that = this;
    if ( item.enabled == IS_ENABLED ) {
      AjaxReq.disableRule( { id: item.id }, ( data ) => {
        that.getRuleList();
      } )
    } else {
      AjaxReq.enableRule( { id: item.id }, ( data ) => {
        that.getRuleList();
      } )
    }

  }

  /*表格-操作-运行点击事件处理*/
  runHandler( item ) {
    this.refs.runConfigPanel.open( item );
  }

  /*表格-操作-查看结果点击事件处理*/
  searchResultHandler( item ) {
    this.refs.ruleResultPanel.open( item );
  }

  /*表格-操作-编辑点击事件处理 - 打开编辑界面*/
  openEditRuleInfo( data ) {
    this.props.openEditRuleInfo( data, true, false, false );
    this.refs.singleDropdown.close();
    this.refs.multiDropdown.close();
  }

  /*表格-页码点击事件处理*/
  pageChange( page ) {
    this.currentPage = page;
    this.getRuleList();
  }

  /*组件实例化完成获取列表数据*/
  componentDidMount() {
    this.loadInterval = setInterval( this.getRuleTypeList(), 100 );
  }

  /*组件将要销毁时，将是否是卸载状态的标识至为false*/
  componentWillUnmount() {
    this.loadInterval && clearInterval( this.loadInterval );
    this.loadInterval = false;
  }

  /*向后端获取规则类型列表*/
  getRuleTypeList() {
    let that = this;
    AjaxReq.getRuleTypeList( {}, ( data ) => {
      data = data.data;
      if ( that.loadInterval ) {
        that.setState( { ...that.state, multiList: data.multiple, singleList: data.single } )
        that.getRuleList();
      }
    } );
  }

  /*获取规则列表*/
  getRuleList() {
    let that = this;
    if ( this.taskData ) {
      AjaxReq.getRuleList( {
        id: this.taskData.id,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }, ( data ) => {
        if ( that ) {
          that.selectedItems = [];
          that.setState( { ...that.state, tableData: data.data } );
        }
      } );
    }
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

  /*向后端请求规则运行*/
  runRule( params, item ) {
    let that = this;
    AjaxReq.executeRule( { id: item.id, ...params }, ( data ) => {
      //1 正在执行
      if ( data.data == "1" ) {
        this.refs.excuteTip.open( item, false );
      } else {//0 执行成功
        message.success( "执行成功" );
        that.getRuleList();
      }
    } );
  }

  /*面包屑切换*/
  breadCrumbChange( index ) {
    this.props.cancelClick();
  }

  render() {
    let column = this.getColumn();
    let deleteDisabled = this.selectedItems && this.selectedItems.length > 0 ? false : true;
    let that = this;
    return (
      <EditPanel
        breadCrumbList={[{text:"稽核任务"},{text:"规则配置"}]}
        onChange={this.breadCrumbChange.bind(this)}>
        <div className="module-container rule-config ">
          <label>稽核任务：</label><label>{this.state.taskName}</label>
          <div className="rule-btn-div dropdown-menu-container">
            <Dropdown ref="singleDropdown">
              <DropdownToggle>
                <IconButton
                  data-code="1020102" renderType="icon"
                  isAuthBtn={false}
                  type="plus-square">新建单表级规则</IconButton>
              </DropdownToggle>
              <DropdownMenu>
                {this.state.singleList.map((item,index) => {
                  return <AuthButton
                    renderType="option"
                    key={index} value={item.name}
                    onClick={this.openEditRuleInfo.bind(this,item)}>{item.name}</AuthButton>
                  })}
              </DropdownMenu>
            </Dropdown>
            <Dropdown ref="multiDropdown">
              <DropdownToggle>
                <IconButton
                  data-code="1020102" renderType="icon"
                  isAuthBtn={false}
                  type="plus-square">新建多表级规则</IconButton>
              </DropdownToggle>
              <DropdownMenu>
                {this.state.multiList.map((item,index) => {
                  return <AuthButton
                    renderType="option"
                    key={index} value={item.name}
                    onClick={this.openEditRuleInfo.bind(this,item)}>{item.name}</AuthButton>
                  })}
              </DropdownMenu>
            </Dropdown>
            <IconButton
              data-code="1020102" renderType="icon" disabled={deleteDisabled}
              type="trash" onClick={this.deleteHandler.bind(this)}>删除</IconButton>
            <IconButton
              renderType="icon" isAuthBtn={false}
              type="refresh" onClick={this.getRuleList.bind(this)}>刷新</IconButton>
          </div>
          <div className="module-table  checkbox-table">
            <DataTable
              column={column}
              showPage="true"
              howRow={this.pageSize}
              data={this.state.tableData}
              onPageChange={this.pageChange.bind(this)}
              onCheckboxSelect={this.handleCheckboxSelect.bind(this)}
            />
          </div>
          <button
            className="btn btn-sm btn-default"
            style={{marginTop:"20px"}}
            onClick={this.props.cancelClick}>返回
          </button>
          <RunConfigPanel ref="runConfigPanel" runHandle={this.runRule.bind(this)}/>
          <RuleResultPanel ref="ruleResultPanel"/>
          <ExcuteTip ref="excuteTip" backToList={this.getRuleList.bind(this)}/>
        </div>
      </EditPanel>
    );
  }
}
export default RuleConfigPanel