import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import { Select ,Option} from 'bfd-ui/lib/Select'
import {BreadCrumb} from 'CommonComponent'
import LeftTree from './LeftTree.jsx'
import ChangedInfo from './tabs/ChangedInfo';
import ShowCodePane from './ShowCodePane';
import RunningInfo from './tabs/RunningInfo';
import EventName from 'EventName'
import AjaxReq from './../model/AjaxReq'

let that;

let topInfo = {
  "taskCode": "",
  "projectName": null,
  "taskName": "",
  "creater": "",
  "updateTime": null,
  "typeName": ""
}

class ScriptInfoForm extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {
      topInfo: {
        "taskCode": "",
        "projectName": null,
        "taskName": "",
        "creater": "",
        "updateTime": null,
        "typeName": ""
      }
    };
  }

  componentDidMount() {
    this.getTopInfo();
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  getTopInfo() {
    let that = this;
    let param = {taskCode: that.props.data};
    AjaxReq.getScriptInfo(param, function (result) {
      if (!that.isUnmount) {
        if (result.data) {
          that.setState({
            topInfo: result.data
          });
        } else if (!result.data) {
          that.setState({
            topInfo: topInfo
          });
        }
      }
    })
  }

  render() {
    that = this;
    return (<div>
      {/**上部基本信息**/}
      <div className="panel">
        <ul>
          <li>脚本名:{this.state.topInfo.typeName}</li>
          <li>脚本类型:{this.state.topInfo.taskName}</li>
          <li>创建人:{this.state.topInfo.creater}</li>
          <li>所属项目:{this.state.topInfo.projectName}</li>
          <li>最近更新时间:{this.state.topInfo.updateTime}</li>
        </ul>
      </div>
      {/**上部返回按钮**/}
      <div className="module-search">
        <button className="btn btn-sm btn-primary common-margin-right" onClick={this.props.cancel}>返回上级</button>
      </div>
      <div id="bfd-tab-style2" className="card-container">
        <Tabs dynamic>
          <TabList>
            <Tab abolishClose="true">运行情况</Tab>
            <Tab abolishClose="true">脚本代码</Tab>
            <Tab abolishClose="true">变更信息</Tab>
          </TabList>
          <TabPanel>
            <div className="module-container" style={{paddingBottom:'20px'}}>
              <RunningInfo taskCode={this.props.data} runningTime_title="运行时长/秒"/>
              </div>
          </TabPanel>
          <TabPanel>
            <div className="module-container" style={{paddingBottom:'20px'}}>
              <ShowCodePane taskCode={this.props.data} typeCode={this.props.typeCode}/>
              </div>
          </TabPanel>
          <TabPanel>
            <div className="module-container" style={{paddingBottom:'20px'}}>
              <ChangedInfo taskCode={this.props.data}/>
              </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
  }
  }

  export default ScriptInfoForm;