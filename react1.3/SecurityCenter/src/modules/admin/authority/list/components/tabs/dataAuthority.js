import React from 'react'
import DataTable from 'bfd-ui/lib/DataTable'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import SeeUser from 'SeeUser'
import SeeRole from 'SeeRole'
import SeeDataPolicy from '../pops/datapolicy'

import Hbase from './dataauthoritytabs/hbaseTable'
import Hdfs from './dataauthoritytabs/hdfsTable'
import Hive from './dataauthoritytabs/hiveTable'
import EventName from 'EventName'
import AjaxReq from '../../../../usermanage/model/AjaxReq'

var that;
class DataAuthority extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
    this.state = {comps: <Hive/>};
  }
  componentDidMount() {
    this.getTenantList();
  }

  componentWillUnmount(){
    that = null;
    if(this.tenantListAjax){
      this.tenantListAjax.abort();
      this.tenantListAjax = null;
    }
  }

  //查询租户list
  getTenantList() {
    let that = this;
    this.tenantListAjax = AjaxReq.getTenantList((result) => {
      if (result && result.length > 0) {
        result.unshift({id: '', tenantName: '全部租户'});
        if (that) {
          that.setState({tenantArr: result})
        }
      }
    })
  }

  seeuser() {
    //弹出查看用户界面
    this.refs.usermodal.open();
  }

  seerole() {
    //弹出查看角色界面
    this.refs.rolemodal.open();
  }

  //表格查看数据策略（点击策略名称）
  seeDataPolicy() {
    //alert("发送事件See_Data_Policy");
    EventEmitter.dispatch(EventName.see_Data_Policy, {});
  }

  render() {
    return (<div className="module-container">
      <div id="bfd-tab-style3">
        <Tabs>
          <TabList>
            <Tab>Hive</Tab>
            <Tab>HBase</Tab>
            <Tab>HDFS</Tab>
          </TabList>
          <TabPanel><Hive tenantArr={this.state.tenantArr}/></TabPanel>
          <TabPanel><Hbase tenantArr={this.state.tenantArr}/></TabPanel>
          <TabPanel><Hdfs tenantArr={this.state.tenantArr}/></TabPanel>
        </Tabs>
      </div>

      <SeeUser ref="usermodal"/>
      <SeeRole ref="rolemodal"/>
    </div>)
  }
}

module.exports = DataAuthority;
