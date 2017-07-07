/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:hbase节点弹出框
 *
 ***************************************************/
import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import BaseWin from '../../common/BaseWin'
import DDL from '../../common/DDL'
import FieldInfo from './FieldInfo'
import TabValidate from '../../common/TabValidate'

const Win = React.createClass({
  //初始化数据。
  getInitialState() {
    return {
      ...this.props.data,
        activeIndex:0
    }
  },
  /**
   * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
   * @returns {*}
   */
  getData() {
          return {
              tableInfo: {...this.refs.tableInfo.getData(),type:2},
              field: this.refs.field?this.refs.field.getData():this.state.field,
              tableType:"hbase",
              edit:this.state.edit
          };
  },

      /**
       * 验证
       * @returns {*|boolean}
       */
      vaildate(flag)
      {
          let isAdd=this.state.field?false:true;
          return TabValidate.validateTab(this,[{tab:this.refs.tableInfo},{tab:this.refs.field}],isAdd,flag)
    },

    handleChange(activeIndex) {
        if(activeIndex==2)
        {
            if(this.refs.ddl)
                this.refs.ddl.getDDLData();
        }
    },



  render() {
    return (
        <Tabs activeIndex={this.state.activeIndex} onChange={this.handleChange}>
          <TabList>
            <Tab>基础信息</Tab>
            <Tab>字段信息</Tab>
            <Tab>DDL</Tab>
          </TabList>
          <TabPanel><BaseWin ref="tableInfo" viewType="hbase"  errorMsg={this.state.errorMsg} data={this.state.tableInfo}/></TabPanel>
          <TabPanel><FieldInfo ref="field" data={this.state.field}/></TabPanel>
          <TabPanel><DDL ref="ddl" titileName="HBase" parent={this}/></TabPanel>
        </Tabs>
    );
  }
});

export default Win;