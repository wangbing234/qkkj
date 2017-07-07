/***************************************************
 * 时间: 2016/7/21 15:48
 * 作者: bing.wang
 * 说明: 我的权限主页面
 *
 ***************************************************/
import React from 'react'
import FunctionAuthority from '../../../../user/authority/myauthority/components/tabs/functionAuthority'
import DataAuthority from './tabs/dataAuthority'
import ResourceAuthority from '../../../../user/authority/myauthority/components/tabs/resourceAuthority'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import {BreadCrumb} from 'CommonComponent'
import '../css/style.less'


class SubLayout extends React.Component {

    constructor(prop) {
        super(prop);
        this.state = {}
    }

    render() {
        return (<div className="module-container">
            <div id="bfd-tab-style2">
                <Tabs>
                    <TabList>
                        <Tab>功能权限</Tab>
                        <Tab>数据权限</Tab>
                        <Tab>资源权限</Tab>
                    </TabList>
                    <TabPanel key="functionAuthority">
                        <FunctionAuthority viewType="owner"/>
                    </TabPanel>
                    <TabPanel key="dataAuthority">
                        <DataAuthority/>
                    </TabPanel>
                    <TabPanel key="resourceAuthority">
                        <ResourceAuthority viewType="owner"/>
                    </TabPanel>
                </Tabs>
            </div>
        </div>);
    }
}

module.exports = SubLayout;
