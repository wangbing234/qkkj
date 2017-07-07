/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 数据权限页面
 *
 ***************************************************/
import React from 'react'
import {Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import HiveTable from './datatab/HiveTable'
import HbaseTable from './datatab/HbaseTable'
import HdfsTable from './datatab/HdfsTable'
import  RoleUtils from '../utils/RoleUtils'
import Ajax from '../../ajax/AjaxReq'
import message from 'CommonComponent/component/bdosmessage'

let that;
class ResourceAuthority  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state={activeIndex:0}
    }
    /**
     * 步骤使用
     */
    vaildate(){
        this.saveData(that.props.cancelAddUser);
    }

    //获取数据
    getData() {
        return  RoleUtils.getResourceData([that.refs.tab0,that.refs.tab1,that.refs.tab2]);
    }

    /**
     * submit按钮提交操作
     * @param e
     */
    saveData(fun) {
        let _data=that.getData();
        if(_data.length>0)
        {
            var infoTenant2={
                "roleIds":[this.props.data ? this.props.data.id : this.props.stepData.step0.roleId],
                "policyIds":_data
            };
            Ajax.addRoleToPolicy(infoTenant2,(data) => {
                that.refresh();
                message.success(data.msg);
                fun && fun();
            });
        }
        else {
            message.success("请您选择需要保存的数据");
        }

    }

    refresh()
    {
        let cTab0=that.refs["tab0"];
        let cTab1=that.refs["tab0"];
        let cTab2=that.refs["tab0"];
        if(cTab0) cTab0.getDataByUrl(1);
        if(cTab1) cTab1.getDataByUrl(1);
        if(cTab2) cTab2.getDataByUrl(1);
    }



    //获取数据
    handleChange(activeIndex) {
        that.state.activeIndex=activeIndex;
    }


    //submit按钮提交操作
    static handleSubmit(e) {
        if(e){e.preventDefault()}
    }

    render() {
        that=this;
        return (
            <div style={this.props.style}>
                <Tabs onChange={this.handleChange}>
                    <TabList>
                        <Tab>HIVE</Tab>
                        <Tab>HBASE</Tab>
                        <Tab>HDFS</Tab>
                    </TabList>
                    <TabPanel><HiveTable  ref="tab0"/></TabPanel>
                    <TabPanel><HbaseTable ref="tab1"/></TabPanel>
                    <TabPanel><HdfsTable  ref="tab2"/></TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default ResourceAuthority;