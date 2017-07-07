import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import FunctionAuthority from './tabs/functionAuthority'
import DataAuthority from './tabs/dataAuthority'
import ResourceAuthority from './tabs/resourceAuthority'
import SeeDataPolicy from './pops/datapolicy'
//import PolicyForm from '../../common/component/hiveForm'
import EventName from 'EventName'

class List extends React.Component {
  constructor(prop) {
    super(prop);
    var that = this;
    EventEmitter.subscribe(EventName.see_Data_Policy, function (data) {
      //alert("监听到See_Data_Policy");
      that.setState({
        showForm: true
      })
    });
    EventEmitter.subscribe(EventName.see_Data_Authority_List, function (data) {
      // alert("监听到See_Data_Authority_List");
      that.setState({
        showForm: false
      })
    });
    this.state = {showForm: false};
  }

  /**取消：切换页面状态**/
  cancleHandler() {
    this.setState({
      showForm: false
    })
  }

  /**
   * 渲染超级管理员下查看权限
   * @return {[component]} [返回查看权限组件]
   */
  renderAdmin() {
    return (
      <div className="authoirty-list">
        <div id="bfd-tab-style2">
          <Tabs>
            <TabList>
              <Tab>功能权限</Tab>
              <Tab>数据权限</Tab>
              {/*<Tab>资源权限</Tab>*/}
            </TabList>
            <TabPanel><FunctionAuthority /></TabPanel>
            <TabPanel><DataAuthority /></TabPanel>
            {/*<TabPanel><ResourceAuthority /></TabPanel>*/}
          </Tabs>
        </div>

      </div>);
  }


  /**渲染表单**/
  /*renderForm() {
    return (<PolicyForm cancel={this.cancleHandler}/>);
  }*/

  render() {
    //用户类型，admin  或者  children
    let comps = this.renderAdmin();
    /*if (this.state.showForm) {
     comps = this.renderForm();
     } else {
     comps = this.renderAdmin();
     }*/
    return (<div className="module-container">
      {comps}
    </div>)
  }
}
module.exports = List;
