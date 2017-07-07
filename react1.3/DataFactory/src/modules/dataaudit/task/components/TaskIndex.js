import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import TaskList from './TaskList'
import TaskInfo from './TaskInfo'
import TaskResultPanel from './TaskResultPanel'
import TaskDescPanel from './TaskDescPanel'
import RuleConfigIndex from './rule/RuleConfigIndex'
import RuleInfoPanel from './rule/RuleInfoPanel'
import AjaxReq from '../ajax/AjaxReq'
import '../../css/style.less'

const LIST_VIEW = "list_view";
const INFO_VIEW = "info_view";
const INFO_DESC_VIEW = "info_desc_view";
const RULE_VIEW = "rule_view";
const RESULT_VIEW = "result_view";


const TaskIndex = React.createClass( {
  getInitialState() {
    return { viewType: LIST_VIEW };
  },
  /*更改页面，显示任务新增编辑界面*/
  taskEditHandler( data ) {
    if(data && data.id){
      AjaxReq.getTaskInfo( { id: data.id }, ( data ) => {
        this.setState( { viewType: INFO_VIEW,taskData:data.data } );
      } );
    }else{
      this.setState( { viewType: INFO_VIEW,taskData:null } );
    }
  },
  /*更改页面，显示任务详情界面*/
  taskDescHandler( data ){
    this.setState( { viewType: INFO_DESC_VIEW, taskData: data } );
  },
  /*更改页面，显示任务列表界面*/
  backToList(){
    this.setState( { viewType: LIST_VIEW } );
  },
  /*更改页面，显示查看结果界面*/
  openResultPanel( data ){
    this.setState( { viewType: RESULT_VIEW, taskData: data } );
  },
  /*更改页面，显示规则配置界面*/
  openRuleConfig( data ){
    this.setState( { viewType: RULE_VIEW , taskData: data } );
  },


  /*渲染列表界面*/
  renderTable() {
    return (<div className="task-list">
      <TaskList
        editClick={this.taskEditHandler}
        addNew={this.taskEditHandler}
        taskDescHandler={this.taskDescHandler}
        openResultPanel={this.openResultPanel}
        openRuleConfig={this.openRuleConfig}
      />
    </div>)
  },
  /*渲染新增编辑界面*/
  renderForm() {
    return (<TaskInfo backToList={this.backToList} taskData={this.state.taskData}/> );
  },

  render(){
    let that = this;
    let comps;
    let viewType = this.state.viewType;
    switch ( viewType ) {
      case INFO_VIEW:
        comps = that.renderForm();
        break;
      case LIST_VIEW:
        comps = that.renderTable();
        break;
      case RESULT_VIEW:
        comps = <TaskResultPanel data={that.state.taskData} backToList={this.backToList}/>
        break;
      case INFO_DESC_VIEW:
        comps = <TaskDescPanel backToList={this.backToList} taskData={that.state.taskData}/>
        break;
      case RULE_VIEW:
        comps = <RuleConfigIndex cancelClick={this.backToList} taskData={that.state.taskData}/>
        break;
      default:
        break;
    }

    return (<div className="data-audit-div">
      {comps}
    </div>)
  }
} );
export default TaskIndex;
