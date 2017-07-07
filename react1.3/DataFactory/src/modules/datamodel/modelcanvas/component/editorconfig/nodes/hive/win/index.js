/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:Hive节点弹出框
 *
 ***************************************************/
import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import BaseWin from '../../common/BaseWin'
import TabValidate from '../../common/TabValidate'
import DDL from '../../common/DDL'
import HighInfo from './HighInfo'
import FieldInfo from './FieldInfo'
let that;
const Win = React.createClass({
    //初始化表单数据。
    getInitialState() {
        let thisState={ ...this.props.data, activeIndex:0};
        this.isEdit=thisState.field?true:false;//是否是编辑状态
        this.fieldIsEdit=!thisState.field  || (thisState.field && thisState.edit);//字段的编辑状态
        this.disabled=thisState.edit;//后台是否可以编辑
        thisState.field=thisState.field||{};
        let fieldState=thisState.field;
        if((!this.disabled || this.props.okButton=="1") &&  fieldState.baseColumns && fieldState.baseColumns.length!=0)
        {
            for (let obj of fieldState.baseColumns) {
                obj.isAdded=true;
            }
        }

        if((!this.disabled || this.props.okButton=="1") &&  fieldState.parColumns && fieldState.parColumns.length!=0)
        {
            for (let obj of fieldState.parColumns) {
                obj.isAdded=true;
            }
        }
        //默认选中
        if(!thisState.advance)
            thisState.advance={fileFormat: "TEXTFILE", storeType: "MANAGED", field: "\\001", colelction: ",",  mapkey: ":" }

        this.iDisabled=this.props.okButton=="1"?{disabled:true}:{};
        return thisState
    },

    /**
     * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
     * isAll 是否需要获取全部字段
     * @returns {*}
     */
    getData(isAll) {
        let fieldObjectCopy=this.refs.field ?this.refs.field.getData():this.state.field;
        let  fieldObject= $.extend(true,{},fieldObjectCopy)
        if(!isAll)
        {
            if(fieldObject.baseColumns)
            fieldObject.baseColumns= fieldObject.baseColumns.filter(item=>(item.isAdded!=true));
            if(fieldObject.parColumns)
            fieldObject.parColumns=  fieldObject.parColumns.filter(item=>(item.isAdded!=true));
        }

        return {
            tableInfo: {...this.refs.tableInfo.getData(),type:1},
            field: fieldObject,
            advance: this.refs.advance ? this.refs.advance.getData():this.state.advance,
            tableType:"hive",
            edit:this.state.edit
        };
    },

    /**
     * 验证
     * @returns {*|boolean}
     */
    vaildate(flag)
    {//,{tab:that.refs.advance}
       return TabValidate.validateTab(this,[{tab:that.refs.tableInfo},{tab:that.refs.field}],!this.isEdit,flag)
    },

    handleChange(activeIndex) {
        if(activeIndex==3)
        {
            if(this.refs.ddl)
                 this.refs.ddl.getDDLData();
        }
    },


    render() {
        that = this;
        //第一次为空都行，或者
        return (
            <Tabs activeIndex={this.state.activeIndex} onChange={this.handleChange}>
                <TabList>
                    <Tab>基础信息</Tab>
                    <Tab>字段信息</Tab>
                    <Tab>高级信息</Tab>
                    <Tab>DDL</Tab>
                </TabList>
                <TabPanel><BaseWin ref="tableInfo" viewType="hive" data={this.state.tableInfo} isEdit={this.isEdit}  errorMsg={this.state.errorMsg} iDisabled={this.iDisabled}/></TabPanel>
                <TabPanel><FieldInfo ref="field" data={this.state.field} allData={this.state}  isEdit={this.fieldIsEdit} okButton={this.props.okButton}/></TabPanel>
                <TabPanel><HighInfo ref="advance" data={this.state.advance} allData={this.state} isEdit={this.fieldIsEdit}  iDisabled={this.iDisabled} /></TabPanel>
                <TabPanel><DDL ref="ddl" parent={this} titileName="Hive"/></TabPanel>
            </Tabs>
        );
    }
});

export default Win;