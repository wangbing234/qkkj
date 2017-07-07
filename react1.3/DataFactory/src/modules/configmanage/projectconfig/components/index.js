/****************************************************
 * create by qing.feng
 * time 2016/7/21 16:12
 * desc：项目配置-主入口
*****************************************************/
import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import {BreadCrumb} from 'CommonComponent'
import NormalConfig from './tabs/NormalConfig';
import ServiceConfig from './tabs/ServiceConfig';
import DevelopConfig from './tabs/DevelopConfig';
import '../css/style.less'

let breadCrumbArr = [ { text: "配置管理" }, { text: "项目配置" } ];
class ProjectConfig extends React.Component {
  constructor( prop ) {
    super( prop )
    this.state = {}
  }

  /*tab改变后，更新当前tab页的数据*/
  tabChange( index, key ) {
    console.log( index );
    if(index == 1 && this.refs.config_tab_1){
      this.refs.config_tab_1.getHiveList();
    }
  }

  render() {
    return (
      <div className="project-config" style={{marginRight: "20px"}}>
        <div id="bfd-tab-style2" className="content-margin module-edit-container" style={{marginTop:"20px"}}>
          <Tabs onChange={this.tabChange.bind(this)}>
            <TabList>
              <Tab>基础配置</Tab>
              <Tab>业务配置</Tab>
              <Tab>开发规范</Tab>
            </TabList>
            <TabPanel>
              <div className="tab-content-margin"><NormalConfig ref="config_tab_0"/></div>
            </TabPanel>
            <TabPanel>
              <div className="tab-content-margin"><ServiceConfig ref="config_tab_1"/></div>
            </TabPanel>
            <TabPanel>
              <div className="tab-content-margin"><DevelopConfig ref="config_tab_2"/></div>
            </TabPanel>
          </Tabs>
        </div>
      </div>);
  }
}

export default ProjectConfig;
