/***************************************************
 * 时间: 2016/7/21 15:46
 * 作者: bing.wang
 * 说明: 数据权限主页
 *
 ***************************************************/
import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import Hive from './hiveTable';
import HBase from './hbaseTable';
import HDFS from './hdfsTable';
import {BreadCrumb} from 'CommonComponent'
import '../css/style.less'
class SubLayout extends React.Component{
    constructor(prop) {
        super(prop);
        this.state = {};
    }

    /**
     * 表单取消事件
     */
    cancleHandler(){
        this.setState({visible: false})
    }

    /**
     * 表单提交事件
     */
    submitHandler(data){
        this.setState({showForm: false})
        console.log('提交表单:', data)

    }

    /**
     * tab切换
     * @param key
     */
    tabChangeHandler(index, key){
        console.log(index);
    }

    render() {

        let cName = ["userMyView","view"].indexOf(this.props.viewType)>-1?'':'module-container';
        return (<div className={cName} >
            <div id={["userMyView","view"].indexOf(this.props.viewType)>-1?"bfd-tab-style3":"bfd-tab-style2"}>
                <Tabs onChange={this.tabChangeHandler}>
                    <TabList>
                        <Tab key="hive">Hive</Tab>
                        <Tab key="hbase">HBase</Tab>
                        <Tab key="hdfs">HDFS</Tab>
                    </TabList>
                    <TabPanel key="hive">
                        <div>  <Hive {...this.props} /></div>
                    </TabPanel>
                    <TabPanel key="hbase">
                        <div>    <HBase {...this.props}/></div>
                    </TabPanel>
                    <TabPanel key="hdfs">
                        <div>   <HDFS {...this.props}/></div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>)
    }
}

module.exports = SubLayout;
