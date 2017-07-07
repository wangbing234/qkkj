import React from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import Hive from './hiveTable';
import HBase from './hbaseTable';
import HDFS from './hdfsTable';
import HiveForm from './form/hiveForm';
import HdfsForm from './form/hdfsForm'
import HbaseForm from './form/hbaseForm';
import AjaxReq from '../../../usermanage/model/AjaxReq'

import AdminEnum from 'AdminEnum'
let that;

class IndexView extends React.Component{
    constructor(prop) {
        super(prop);
        that = this;
        this.state = {
            viewType:AdminEnum.LIST_UI,
            activeIndex:0
        }
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

    addPolicy() {
        that.setState({})
    }

    /**
     * 表单取消事件 tabIndex 0:hive,1:hbase,2:hdfs
     */
    cancleHandler(tabIndex){
        that.setState({viewType:AdminEnum.LIST_UI,activeIndex:tabIndex})
    }


    tabChangeHandler(index, key){
        console.log(index);
    }

    editForm(type,viewType,data){
        this.type = type;
        this.formData = data;
        this.setState({viewType:viewType})
    }

    /**新增hdfs**/
    addForm(){
        this.formData = {};
        this.setState({viewType:AdminEnum.ADD_UI})
    }

    renderForm(type){
        let formComp;
        let hdfsComp = <HdfsForm cancel={this.cancleHandler.bind(this)} data={this.formData}
                                 viewType={this.state.viewType} resources={["path"]}/>;
        if(type){//新增hdfs策略
            formComp = hdfsComp;
        } else {
            switch (this.type){
                case 'hive':
                    formComp = <HiveForm cancel={this.cancleHandler.bind(this)} data={this.formData}
                                         resources={["database"]} viewType={this.state.viewType}/>;
                    break;
                case 'hbase':
                    formComp = <HbaseForm cancel={this.cancleHandler.bind(this)} data={this.formData} resources={["database"]} viewType={this.state.viewType}/>;
                    break;
                case 'hdfs':
                    formComp = hdfsComp;
                    break;
            }
        }
        return formComp;
    }

    renderList(){
        return (
          <div id="bfd-tab-style2">
              <Tabs onChange={this.tabChangeHandler} activeIndex={this.state.activeIndex}>
                  <TabList>
                      <Tab key="hive" >Hive</Tab>
                      <Tab key="hbase">HBase</Tab>
                      <Tab key="hdfs">HDFS</Tab>
                  </TabList>
                  <TabPanel key="hive">
                      <Hive editForm={this.editForm.bind(this)} tenantArr={this.state.tenantArr}/>
                  </TabPanel>
                  <TabPanel key="hbase">
                      <HBase editForm={this.editForm.bind(this)} tenantArr={this.state.tenantArr}/>
                  </TabPanel>
                  <TabPanel key="hdfs">
                      <HDFS editForm={this.editForm.bind(this)} addForm={this.addForm.bind(this)} tenantArr={this.state.tenantArr}/>
                  </TabPanel>
              </Tabs>
          </div>
        )
    }


    render() {
        let comp;
        that=this;
        if(this.state.viewType == AdminEnum.LIST_UI){
            comp = this.renderList();
        } else if(this.state.viewType == AdminEnum.EDIT_UI || this.state.viewType == AdminEnum.SEE_UI){
            comp = this.renderForm();
        } else if (this.state.viewType == AdminEnum.ADD_UI){
            comp = this.renderForm('hdfs');
        }
        return (<div className="module-container"> {comp}  </div>)
    }
}

module.exports = IndexView;
