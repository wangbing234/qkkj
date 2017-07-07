/****************************************
 * 时间: 16/8/16
 * 作者: liujingjing
 * 说明: 查找表表格 props---listInfo{projectCode:'' ,database:''}  tableName:'' ,没有均设成''
 *
 ****************************************/
import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import FieldInfo from './tabs/FieldInfo'
import PartitionInfo from './tabs/PartitionInfo'
import MemeryInfo from './tabs/MemeryInfo'
import ChangedInfo from './tabs/ChangedInfo';
import ShowCodePane from './ShowCodePane';
import AdvanceSetting from './tabs/AdvanceSetting';
import OutputInfo from './tabs/OutputInfo'
import ConsanguinityInfo from './tabs/ConsanguinityInfo';


class TableTabs extends React.Component {


  constructor(prop) {
    super(prop);
    this.state = {
      activeIndex: 0
    };
  }

  render() {
    return (
      <div className="card-container">
        <div id="bfd-tab-style2">
          <Tabs dynamic activeIndex={this.state.activeIndex}>
            <TabList>
              <Tab abolishClose="true">字段信息</Tab>
              <Tab abolishClose="true">分区信息</Tab>
              <Tab abolishClose="true">存储信息</Tab>
              <Tab abolishClose="true">血缘关系</Tab>
              <Tab abolishClose="true">产出信息</Tab>
              <Tab abolishClose="true">变更信息</Tab>
              <Tab abolishClose="true">DDL语句</Tab>
              <Tab abolishClose="true">高级设置</Tab>
            </TabList>
            <TabPanel>
              <div className="module-container" style={{paddingBottom:'20px'}}>
                <FieldInfo table={this.props.table}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="module-container" style={{paddingBottom:'20px'}}>
                <PartitionInfo table={this.props.table}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="module-container" style={{paddingBottom:'20px'}}>
                <MemeryInfo table={this.props.table}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="module-container" style={{paddingBottom:'20px'}}>
                <ConsanguinityInfo table={this.props.table}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="module-container" style={{paddingBottom:'20px'}}>
                <OutputInfo table={this.props.table}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="module-container" style={{paddingBottom:'20px'}}>
                <ChangedInfo table={this.props.table}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="module-container" style={{paddingBottom:'20px'}}>
                <ShowCodePane table={this.props.table}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="module-container" style={{paddingBottom:'20px'}}>
                <AdvanceSetting table={this.props.table}/>
              </div>
            </TabPanel>

          </Tabs>
        </div>

      </div>
    );
  }

}

export default TableTabs;
