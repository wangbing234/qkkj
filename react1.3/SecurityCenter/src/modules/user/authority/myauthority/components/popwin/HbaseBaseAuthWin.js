/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:hbase我的权限页面
 *
 ***************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import {RestrictInput,RestrictConst} from 'CommonComponent'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import   RegularConst from "CommonComponent/utils/RegularConst"
import   Ajax from  "../../ajax/AjaxReq"
import { Select ,Option2} from 'bfd-ui/lib/Select2'
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import ConstUtil from  '../../../../../common/model/ConstUtil'
var that;
let hiveList=[];
let dataBaseList=[];
let tableList=[];
let columnFamilyList=[];
let columnList=[];

let newAccesses=[];
class Hbase extends React.Component{
    constructor(prop){
        super(prop);
        let baseData={ "id":0, "resourceType": "hbase", "createUser": "jupiter",
            "updateUser": "jupiter",
            "createTime": 1464317482000,
            "updateTime": 1465366331000, accesses:$.extend(true,[],ConstUtil.ACCESSES_DATA_HBASE)}

        if(this.props.data)
        {
            newAccesses=this.props.data.accesses;
            delete  this.props.data.accesses;
        }
        this.state={...baseData,...this.props.data};
        if(!this.state.table)
            this.state.table=["*"];
        if(!this.state["column-family"])
            this.state["column-family"]=["*"];
        if(!this.state["column"])
            this.state["column"]=["*"];
        this.rules = {
            applyName: value => {
                return BaseValidate.validateInput({isRequired: true, label: "申请名称", value: value, maxLength:64});
            },
            accesses: value => {//验证有些问题
                let msg ='权限类型不能为空';
                value.map((item,index)=>{
                    if(item.isAllowed == true){
                        msg = ''
                    }
                });
                return msg;
            },
            resourceId: value => {
                return BaseValidate.validateInput({isRequired:true,label:"Hbase源",value:(value=="请选择"?"":value)});
            } ,
            database: value => {
                return BaseValidate.validateInput({isRequired:true,label:"命名空间",value:(value=="请选择"?"":value)});
            },
            table: value => {
                return BaseValidate.validateInput({isRequired:true,label:"表名",value:(value=="请选择"?"":value)});
            },
            "column-family": value => {
                return BaseValidate.validateInput({isRequired:true,label:"列簇",value:(value=="请选择"?"":value)});
            },
            column: value => {
                return BaseValidate.validateInput({isRequired:true,label:"列名",value:(value=="请选择"?"":value)});
            } ,
            applyReason: value => {
                return BaseValidate.validateInput({isRequired:false,label:"描述",value,maxLength:255});
            }
        };
    }

    componentDidMount() {
        if(this.props.data)
        {
            this.queryResource();
            this.queryDatabase();
            this.queryTables();
            this.queryColumnFamily();
            this.queryColumn();
        }
        else
        {
            this.queryResource();
        }
        this.handerAccess();
    }

    /**
     * 查询资源
     */
    queryResource()
    {
        Ajax.listHbaseResource(null,(data) => {
            hiveList=data;
            that.setState();
        })
    }

    /**
     * 查询数据库
     */
    queryDatabase()
    {
        Ajax.hbaseTenantNamespace(this.state,(data) => {
            dataBaseList=data;
            that.setState();
        })
    }

    /**
     * 查询数据表
     */
    queryTables()
    {
        Ajax.listHbaseTable(this.state,(data) => {
            tableList=data;
            that.setState();
        })
    }

    /**
     * 查询列簇
     */
    queryColumnFamily()
    {
        Ajax.listHbaseColumnfamily(this.state,(data) => {
            columnFamilyList=data;
            that.setState();
        })
    }

    /**
     * 查询列
     */
    queryColumn()
    {
        //Ajax.queryColumn(this.state,(data) => {
        //    columnList=data;
        //    that.setState();
        //})
    }

    /**
     * hive修改
     */
    hiveChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryDatabase();
    }

    /**
     *数据库修改
     */
    dataBaseChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryTables();
    }

    /**
     * 表修改
     * @param dataField
     * @param evt
     */
    tableChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryColumnFamily();
    }

    /**
     *列簇修改
     */
    columnFamilyChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryColumn();
    }

    /**
     *公用修改状态
     */
    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.state[dataField]=value;
    }

    /**
     *验证
     */
    doVaildate(){
        return that.refs.form.validate(that.state);
    }

    /**
     *获取数据
     */
    getData(){
        return that.state;
    }

    /**
     *处理权限信息
     */
    handerAccess():void
    {
        if(newAccesses)
        {
            this.state.accesses.map((item1,index)=>{
                newAccesses.map((item,index)=>{
                    if(item1.type == item.type && item.isAllowed)
                    {
                        item1.isAllowed=true;
                        return;
                    }
                });
            });
            this.setState({accesses:this.state.accesses});
        }

    }

    render(){
        that = this;
        return (
            <div className="p-container" style={{marginLeft:40}}>
                <Form ref="form" rules={this.rules}>
                    <FormItem label="申请名称"   required name="applyName">
                        <RestrictInput type="text" className="form-control common-form-input"
                                       onChange={this.handleChange.bind(this,"applyName")}
                                       value={this.state.applyName}
                                       restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                                       tipString="只能输入中文、字母、数字、下划线、长度小于64个字符" />
                    </FormItem>
                    <FormItem label="策略名称"    name="policyName">
                        <RestrictInput type="text" className="form-control common-form-input"
                                       onChange={this.handleChange.bind(this,"policyName")}
                                       value={this.state.policyName}
                                       maxLength="64"
                                       //restrict={RestrictConst.NUM_START_STRING_UNDERLINE_64}
                                       //tipString="只能输入字母、数字、下划线且必须以字母开头，长度小于64个字符"
                        />
                    </FormItem>
                    <FormItem label="Hbase源" name="resourceId" required>
                        <Select value={this.state.resourceId} className="common-select" onChange={this.hiveChange.bind(this,"resourceId")} placeholder="请选择">
                            {hiveList.map((item,index)=>{return (<Option2 key={item.id} value={item.id}>{item.name}</Option2>)})}
                        </Select>
                    </FormItem>
                    <FormItem label="命名空间"  required name="database">
                        <Select  value={this.state.database} className="common-select" onChange={this.dataBaseChange.bind(this,"database")} placeholder="请选择">
                            {dataBaseList.map((item,index)=>{return (<Option2 key={item} value={item}>{item}</Option2>)})}
                        </Select>
                    </FormItem>
                    <FormItem label="表名" required name="table">
                        <MultipleSelect values={that.state.table}  className="common-select" tagable
                                        onChange={this.tableChange.bind(this,'table')}>
                            {tableList.map((item,index)=>{return (<Option key={item} value={item}>{item}</Option>)})}
                        </MultipleSelect>
                    </FormItem>
                    <FormItem label="列簇" required name="column-family">
                        <MultipleSelect values={that.state["column-family"]}  className="common-select" tagable
                                        onChange={this.handleChange.bind(this,'column-family')}>
                            {columnFamilyList.map((item,index)=>{return (<Option key={item} value={item}>{item}</Option>)})}
                        </MultipleSelect>
                    </FormItem>
                    { <FormItem label="列名" required name="column">
                        <MultipleSelect values={that.state["column"]}  className="common-select" tagable
                                        onChange={this.handleChange.bind(this,'column')}>
                            {columnList.map((item,index)=>{return (<Option key={item.id} value={item.id}>{item.value}</Option>)})}
                        </MultipleSelect>
                    </FormItem>
                     }
                    <FormItem label="权限类型" required name="accesses">
                        <CheckBoxAll ref="accessesBox" key="type" value="type" list={this.state.accesses} checkedField="isAllowed"/>
                    </FormItem>
                    <FormItem label="申请理由"  name="applyReason">
                        <RestrictTextarea className="form-control common-textarea"
                                          value={this.state.applyReason}
                                          onChange={this.handleChange.bind(this,"applyReason")}/>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Hbase;
