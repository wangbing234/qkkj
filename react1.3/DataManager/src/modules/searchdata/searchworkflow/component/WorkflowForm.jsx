import React from "react";
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import RunningInfo from './tabs/RunningInfo';
import ChangedInfo from './tabs/ChangedInfo.jsx';
import WorkflowCanvas from './tabs/WorkflowCanvas';
import AjaxReq from '../model/AjaxReq'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
//import {BreadCrumb} from 'CommonComponent'
/*const breadCrumbArr = [{
 text: '查找数据',
 url:''
 },{
 text: '查找脚本',
 url:''
 }];*/
let that;
class WorkflowForm extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    this.state = {workflow: {}, ...this.props.data}
  }

  componentDidMount() {
    this.getWorkFlowDescInfo();
  }

  /**查询项目描述信息**/
  getWorkFlowDescInfo() {
    let param = {projectCode: this.props.data.projectCode, processKey: this.props.data.key};
    AjaxReq.getWorkFlowDescInfo(param, (result) => {
      if (that) {
        that.setState({wfDescInfo: result})
      }
    })
  }

  render() {
    that = this;
    let updateTimeStr = this.state.wfDescInfo ? new Date(this.state.wfDescInfo.updateTime).format("yyyy-MM-dd hh:mm:ss") : '';
    return (<div>
      <div className="panel">
        <ul>
          <li>工作流:&nbsp;{this.state.wfDescInfo ? this.state.wfDescInfo.name : ''}</li>
          <li>状态:&nbsp;{this.state.wfDescInfo ? CommonUtil.getWfState(this.state.wfDescInfo.flowState) : ''}</li>
          <li>创建人:&nbsp;{this.state.wfDescInfo ? this.state.wfDescInfo.createUser : ''}</li>
          <li>所属项目:&nbsp;{this.state.wfDescInfo ? this.state.wfDescInfo.projectCode : ''}</li>
          <li>最新更新时间:&nbsp;{updateTimeStr}</li>
        </ul>
      </div>
      <div className="module-search">
        <button className="btn btn-sm btn-primary common-margin-right" onClick={this.props.cancel}>返回</button>
      </div>
      <div id="bfd-tab-style2">
        <Tabs dynamic>
          <TabList>
            <Tab abolishClose="true">运行情况</Tab>
            {/*<Tab abolishClose="true">工作流图</Tab>*/}
            <Tab abolishClose="true">变更信息</Tab>
          </TabList>
          <TabPanel>
            <div className="module-container" style={{paddingBottom:'20px'}}>
              <RunningInfo runningTime_title="运行时长/小时" projectCode={this.props.data.projectCode}
                           processKey={this.props.data.key}/>
            </div>
          </TabPanel>
          {/*<TabPanel> <WorkflowCanvas/></TabPanel>*/}
          <TabPanel>
            <div className="module-container" style={{paddingBottom:'20px'}}>
              <ChangedInfo projectCode={this.props.data.projectCode} processKey={this.props.data.key}/>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>);
  }
}

export default WorkflowForm;