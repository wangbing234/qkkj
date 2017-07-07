/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:我的权限主页面
 *
 ***************************************************/
import React from 'react'
import FunctionAuthority from './tabs/functionAuthority'
import ResourceAuthority from './tabs/resourceAuthority'
import CommonModalWin from 'CommonModalWin'
import  DataPolicy from 'DataPolicy'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import {BreadCrumb} from 'CommonComponent'
import HiveBaseAuthWin from './popwin/HiveBaseAuthWin'
import HbaseBaseAuthWin from './popwin/HbaseBaseAuthWin'
import HdfsBaseAuthWin from './popwin/HdfsBaseAuthWin'
import Ajax from '../ajax/AjaxReq'
import '../css/index.less'
import ConstType  from '../../utils/ConstType'

class SubLayout extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {}
    }
    /**
     * 提交hive
     * @param e
     * @param item
     */
    submitHiveEdit(item,e){
        this.submitHbaseEdit(item,e)
    }

    /**
     * 提交hbase
     * @param e
     * @param item
     */
    submitHbaseEdit(item, e) {

        let authApprove;
        let detailsString;
        switch (item.resourceType) {
            case "hive":
                detailsString = JSON.stringify({
                    tenantId: window._currentUser.tenantId,
                    resourceType: item.resourceType.toLowerCase(),
                    resourceId: item.resourceId,
                    database: item.database,
                    table: item.table,
                    policyName: item.policyName,
                    column: item.column,
                    authorityList: item.accesses
                });
                authApprove = {
                    applyName: item.applyName,
                    applyType: 1,
                    approveType: 0,
                    details: detailsString,
                    applyReason: item.applyReason
                }
                break;
            case "hbase":
            {
                detailsString = JSON.stringify({
                    tenantId: window._currentUser.tenantId,
                    policyName: item.policyName,
                    resourceType: item.resourceType.toLowerCase(),
                    resourceId: item.resourceId,
                    database: item.database,
                    table: item.table,
                    columnFamily: item["column-family"],
                    column: item.column,
                    authorityList: item.accesses
                });
                authApprove = {
                    applyName: item.applyName,
                    applyType: 1,
                    approveType: 0,
                    details: detailsString,
                    applyReason: item.applyReason
                }
                break;
            }
            case "hdfs":
            {
                detailsString = JSON.stringify({
                    tenantId: window._currentUser.tenantId, resourceType: item.resourceType.toLowerCase(),
                    policyName: item.policyName, path: item.path, authorityList: item.accesses
                });
                authApprove = {
                    applyName: item.applyName,
                    applyType: 1,
                    approveType: 0,
                    details: detailsString,
                    applyReason: item.applyReason
                }
                break;
            }
        }
        let that = this;
        Ajax.applyAuth(authApprove, (data) => {
            EventEmitter.dispatch(ConstType.REFRESH_MY_APPLY)
            that.refs._modalHive.refs._modal.close();
            that.refs._modalHbase.refs._modal.close();
            that.refs._modalHdfs.refs._modal.close();
        })

    }

    /**
     * 提交hdfs
     * @param e
     * @param item
     */
    submitHdfsEdit(e,item){
        this.refs._modalHdfs.refs._modal.close();
    }

    /**
     * 申请数据
     * @param type
     */
    applyData(type){
        switch (type) {
            case "hive":
            {
                this.refs._modalHive.refs._modal.open();
                break;
            }
            case "hbase":
            {
                this.refs._modalHbase.refs._modal.open();
                break;
            }
            case "hdfs":
            {
                this.refs._modalHdfs.refs._modal.open();
                break;
            }
        }
    }

    render() {
        return (
            <div className="module-container myauthority_index" id="bfd-tab-style2" >
                <Tabs>
                    <TabList>
                        <Tab>功能权限</Tab>
                        <Tab>数据权限</Tab>
                        <Tab>资源权限</Tab>
                    </TabList>
                    <TabPanel key="functionAuthority">
                        <FunctionAuthority  viewType="user"/>
                    </TabPanel>
                    <TabPanel key="dataAuthority">
                        <div className="module-container">
                            <DataPolicy  viewType="userMyView" applyData={this.applyData.bind(this)}/>
                        </div>
                    </TabPanel>
                    <TabPanel key="resourceAuthority">
                        <ResourceAuthority  viewType="user"/>
                    </TabPanel>
                </Tabs>

                <CommonModalWin title="HIVE数据申请" {...this.props} ref="_modalHive" Child={HiveBaseAuthWin}  className="width700"
                                submit={this.submitHbaseEdit.bind(this)}/>
                <CommonModalWin title="HBASE数据申请" {...this.props} ref="_modalHbase" Child={HbaseBaseAuthWin}  className="width700"
                                submit={this.submitHbaseEdit.bind(this)}/>
                <CommonModalWin title="HDFS数据申请" {...this.props} ref="_modalHdfs" Child={HdfsBaseAuthWin} className="width700"
                                submit={this.submitHbaseEdit.bind(this)}/>
            </div>);
    }
}

module.exports = SubLayout;
