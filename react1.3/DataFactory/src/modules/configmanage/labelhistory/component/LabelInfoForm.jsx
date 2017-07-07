import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import ScriptForm from './tabs/ScriptForm';
import WorkflowForm from './tabs/WorkflowForm';
import DataCheck from './tabs/DataCheck';
import ProjectConfig from './tabs/ProjectConfig'
import DataModel from './tabs/DataModel'

import "./style.less"

class LabelInfoForm extends React.Component {
    constructor(prop) {
        super(prop)
        this.state = {projectName: "aaaa", labelVersion: "v1.2.12.123"}
    }

    render() {
        return (<div className="label-info-form-div">
                    <div className="row" style={{marginTop:"10px",marginBottom:"30px"}}>
                        <div className="col-md-4">
                            <span>项目名称：</span>
                            <input type="text" disabled className="form-control" style={{display:"inline-block",width:"260px"}}
                                   value={this.state.projectName}/>
                         </div>
                       <div className="col-md-4">
                            <span>版本标签：</span>
                            <input type="text" disabled className="form-control" style={{display:"inline-block",width:"260px"}}
                                   value={this.state.labelVersion}/>
                        </div>
                    </div>
            <Tabs>
                <TabList>
                    <Tab>项目配置</Tab>
                    <Tab>数据模型</Tab>
                    <Tab>脚本</Tab>
                    <Tab>工作流</Tab>
                    <Tab>数据稽核</Tab>
                </TabList>
                <TabPanel><div className="tab-content-margin"><ProjectConfig/></div></TabPanel>
                <TabPanel><div className="tab-content-margin"><DataModel/></div></TabPanel>
                <TabPanel><div className="tab-content-margin"><ScriptForm/></div></TabPanel>
                <TabPanel><div className="tab-content-margin"><WorkflowForm/></div></TabPanel>
                <TabPanel><div className="tab-content-margin"><DataCheck/></div></TabPanel>
            </Tabs>
        </div>);
    }
}
export default LabelInfoForm;