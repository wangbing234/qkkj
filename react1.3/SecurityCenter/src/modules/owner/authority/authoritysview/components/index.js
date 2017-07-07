/***************************************************
 * 时间: 2016/7/21 15:45
 * 作者: bing.wang
 * 说明: 查看权限主页面
 *
 ***************************************************/
import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import {BreadCrumb} from 'CommonComponent'
import ResourceAuthorityOwner from './tabs/resourceAuthority'
import  DataPolicy from 'DataPolicy'
import '../css/index.less'
import SeeUser from 'SeeUser'
import SeeRole from 'SeeRole'
class List extends React.Component{
    constructor(prop) {
        super(prop);
    }


    /**
     * 渲染租户所有者下查看权限
     * @return {[component]} [返回查看权限组件]
     */
    renderOwner(){
        return(<Tabs>
                <TabList>
                    <Tab>数据权限</Tab>
                    <Tab>资源权限</Tab>
                </TabList>
                <TabPanel>
                    <div className="module-container">
                    <DataPolicy viewType="view" viewHander={this.viewHander.bind(this)}/>
                        </div>
                </TabPanel>
                <TabPanel><ResourceAuthorityOwner /></TabPanel>
            </Tabs>);
    }

    /**
     * 查看用户
     * @param type
     * @param data
     */
    viewHander(type,data){
        if(type=="user")
        {
            this.refs.usermodal.open();
            this.refs.usermodal.setObjectArray(data.users);
        }

        else{
            this.refs.rolemodal.open();
            this.refs.rolemodal.setObjectArray(data.roles);
        }
    }


    render() {
        return (<div className="module-container">
                        <div id="bfd-tab-style2" className="authority_view_div">
                            {this.renderOwner()}
                        </div>
            <SeeUser ref="usermodal"/>
            <SeeRole ref="rolemodal"/>
                </div>)
    }
}
module.exports = List;
