import React from 'react';
import RuleConfigPanel from './RuleConfigListPanel'
import RuleInfoPanel from './RuleInfoPanel'
import AjaxRequest from '../../ajax/AjaxReq'

const RULE_INFO_VIEW = "rule_info_view";
const RULE_LIST_VIEW = "rule_list_view";

class RuleConfigIndex extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      viewType:RULE_LIST_VIEW
    };
  }

  /*打开编辑/新增规则配置界面*/
  openEditRuleInfo(data, isNew, isLook,isSaveAs){
    this.ruleIsNew = isNew;//是新增还是编辑
    this.ruleIsLook = isLook;//是否是只是查看
    this.isSaveAs = isSaveAs;
    if(isNew){
      this.setState({viewType:RULE_INFO_VIEW, ruleInfoData:data})
    }else{
      AjaxRequest.getRuleInfo({id:data.id}, (result) => {
        result = result.data;
        this.setState({viewType:RULE_INFO_VIEW, ruleInfoData:result})
      });
    }
  }
  /*更改页面，显示任务列表界面*/
  backToList(){
    this.setState( { viewType: RULE_LIST_VIEW } );
  }
  render(){
    let comps;
    switch (this.state.viewType){
      case RULE_INFO_VIEW:
        comps = <RuleInfoPanel
          isNew={this.ruleIsNew}
          isLook={this.ruleIsLook}
          isSaveAs={this.isSaveAs}
          data={this.state.ruleInfoData} //data 单个rule的数据
          taskData={this.props.taskData} //当前任务的数据
          backToList={this.backToList.bind(this)}
          backToTaskList={this.props.cancelClick}
        />
        break;
      case RULE_LIST_VIEW:
        comps = <RuleConfigPanel
          taskData={this.props.taskData}
          openEditRuleInfo={this.openEditRuleInfo.bind(this)}
          cancelClick={this.props.cancelClick}/>
        break;
    }
    return (
      <div className="task-list">
        {comps}
      </div>
    );
  }
}
export default RuleConfigIndex