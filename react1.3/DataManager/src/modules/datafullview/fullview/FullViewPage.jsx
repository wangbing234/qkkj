/****************************************
 * 时间: 16/8/7
 * 作者: liujingjing
 * 说明: 数据全景页面
 *
 ****************************************/

import React from 'react'

import TableTopDiv from './topView/TableTopDiv';
import ScriptTopDiv from './topView/ScriptTopDiv';
import WorkFlowTopDiv from './topView/WorkFlowTopDiv';
import ProjectTopDiv from './topView/ProjectTopDiv';

import GridHotTableView from './tableview/GridHotTableView';
import GridProjectView from './tableview/GridProjectView';
import GridScriptView from './tableview/GridScriptView';
import GridTableView from './tableview/GridTableView';

import AjaxReq from './model/AjaxReq'
import EventName from 'EventName'

let that;

class FullViewPage extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      project_count: 0,
      project_total_storage: 0,
      project_total_storage_str: "0.0",
      table_count: 0,
      table_total_storage: 0,
      table_total_storage_str: "0.0",
      script_count: 0,
      script_scheduler_count: 0,
      workflow_count: 0,
      workflow_run: 0,
      tableStorageTopTime: 0,
      tableStorageTopTime_str: "",
      tableStorageTopList: {totalList: []},
      //租户ID,默认为空,all
      tenant: ''
    };
    // 监听切换租户事件
    EventEmitter.subscribe(EventName.CHANGE_TENANT, this.updateDataByTenant);
  }

  // 组件实例化完成获取列表数据
  componentDidMount() {
    this.isUnmount = false;
    this.getData();
  }

  // 组件将要销毁时，将是否是卸载状态的标识至为true
  componentWillUnmount() {
    this.isUnmount = true
  }

  componentWillReceiveProps(nextProps) {
    console.log(this);
  }

   //切换租户激活事件,更新数据
  updateDataByTenant(tenantId){
    that.getData(); // 不用通过tenantId,通过window.tenant获取
  }


  // 获取数据全景页面全部数据
  getData() {
    //let that = this;
    let param = {tenant: window.currentTenant};
    AjaxReq.getData(param, function(result) {
      if(!that.isUnmount && result.data){
        that.setState({
          // 上部4个框
          project_count:result.data.project_count,
          project_total_storage_str: result.data.project_total_storage_str,
          table_count: result.data.table_count,
          table_total_storage_str: result.data.table_total_storage_str,
          script_count:result.data.script_count,
          script_scheduler_count: result.data.script_scheduler_count,
          workflow_count: result.data.workflow_count,
          workflow_run: result.data.workflow_run
        });
        if(!that.isUnmount && result.data.tableStorageTopList && result.data.tableStorageTopList.totalList) {
          that.setState({
            // 表存储Top数据
            tableStorageTopTime_str: result.data.tableStorageTopTime_str,
            tableStorageTopList: result.data.tableStorageTopList
          });
        }
      } else if(!that.isUnmount) {
        that.setState({
          tableStorageTopList: {totalList:[]}
        });
      }
    });

  }

  render() {
    that = this;
    return (
      <div style={{width:'100%',height:'100%',paddingLeft:"0px"}} className="container fullviewPage">
        {/*上部基本信息*/}
        <div className="row" style={{textAlign:"center","marginLeft":"0px",marginTop:"10px"}}>
          <div className="col-md-3" style={{textAlign:"center",padding:'0 10px 0 15px'}}>
            <ProjectTopDiv lineUpValue={this.state.project_count} lineDownValue={this.state.project_total_storage_str}/>
          </div>
          <div className="col-md-3" style={{textAlign:"center",padding:'0 10px'}}>
            <TableTopDiv lineUpValue={this.state.table_count} lineDownValue={this.state.table_total_storage_str}/>
          </div>
          <div className="col-md-3" style={{textAlign:"center",padding:'0 10px'}}>
            <ScriptTopDiv lineUpValue={this.state.script_count} lineDownValue={this.state.script_scheduler_count}/>
          </div>
          <div className="col-md-3" style={{textAlign:"center",padding:'0 15px 0 10px'}}>
            <WorkFlowTopDiv lineUpValue={this.state.workflow_count} lineDownValue={this.state.workflow_run}/>
          </div>
        </div>
        {/*下部top5表格第一行*/}
        <div className="row" style={{textAlign:"center","marginLeft":"0px",marginTop:"20px",height:"300px"}}>
          <div className="col-md-6" style={{height:"100%",paddingRight:'10px'}}>
            <GridProjectView/>
          </div>
          <div className="col-md-6" style={{height:"100%",padding:'0 15px 0 10px'}}>
            <GridScriptView/>
          </div>
        </div>
        {/*下部top5表格第二行*/}
        <div className="row" style={{textAlign:"center",marginLeft:"0px",marginTop:"20px",marginBottom:"20px",height:"300px"}}>
          <div className="col-md-6" style={{textAlign:"center",height:"100%",paddingRight:'10px'}}>
            <GridTableView topTime_str={this.state.tableStorageTopTime_str} topList={this.state.tableStorageTopList}/>
          </div>
          <div className="col-md-6" style={{textAlign:"center",height:"100%",padding:'0 15px 0 10px'}}>
            <GridHotTableView/>
          </div>
        </div>
      </div>
    );
  }
}

export default FullViewPage;