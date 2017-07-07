/***************************************************
 * 时间: 2016/7/21 15:17
 * 作者: bing.wang
 * 说明: 权限审批主类，调用admin中的审批
 *
 ***************************************************/
import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import AuthoritySpMain from '../../../../admin/authority/authoritysp/components/AuthoritySpMain'
import MyApplyMain from '../../../../user/authority/myapply/components'
import '../css/style.less'
class SubLayout extends React.Component{
    constructor(prop) {
        super(prop);
    }

    render() {
        return (
            <div className="module-container">
                <div id="bfd-tab-style2">
                    <Tabs>
                        <TabList>
                            <Tab>权限审批</Tab>
                            <Tab>我的申请</Tab>
                        </TabList>
                        <TabPanel><div style={{paddingBottom:'20px'}}><AuthoritySpMain  viewType="telantSp"/></div></TabPanel>
                        <TabPanel><MyApplyMain  viewType="telantSp"/></TabPanel>
                    </Tabs>
                </div>
             </div>)
    }
}

export default SubLayout;
