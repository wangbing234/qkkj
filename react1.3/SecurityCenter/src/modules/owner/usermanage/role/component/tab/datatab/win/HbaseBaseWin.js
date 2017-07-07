/***************************************************
 * 时间: 2016/7/21 16:11
 * 作者: bing.wang
 * 说明: hbase编辑页面
 *
 ***************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import {RestrictInput,RestrictConst} from 'CommonComponent'
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import   RegularConst from "CommonComponent/utils/RegularConst"
import Ajax from '../../../../ajax/AjaxReq'
import { Select ,Option2} from 'bfd-ui/lib/Select2'
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import ConstUtil from  '../../../../../../../common/model/ConstUtil'
var that;
let hiveList=[];
let dataBaseList=[];
let tableList=[];
let columnFamilyList=[];
let columnList=[];
let newAccesses=[];
class HbaseBaseWin extends React.Component{
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
        this.state={...baseData,...this.props.data};//,column:["*"]
        if(this.state.database && this.state.database  instanceof Array && this.props.operatorType!="userRoleDetail")
        {
            this.state.database=this.state.database[0]
        }
        this.rules = {
            policyName: value => {
                let resultStringpolicyName= BaseValidate.validateInput({isRequired: true, label: "策略名称", value: value, maxLength:64});
                if(!resultStringpolicyName   && that.oldPolicyName!=value)
                {
                    Ajax.isExistPolicyName({policyName:value,type:that.state.resourceType},(data)=>{
                        if(data.data==true)
                            resultStringpolicyName=data.msg;
                    });
                }
                return resultStringpolicyName;
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
            description: value => {
                return BaseValidate.validateInput({isRequired:false,label:"描述",value});
            }
        };
        this.oldPolicyName=this.state.policyName;
    }

    componentDidMount() {
        if(this.props.data)
        {
            this.queryResource();
            this.queryDatabase();
            this.queryTables();
            this.queryColumnFamily();
            //this.queryColumn();
        }
        else
        {
            this.queryResource();
        }
        this.handerAccess();
    }

    /**
     * 获取资源
     */
    queryResource()
    {
        Ajax.listPolicyResourceByType({type:"hbase"},(data) => {//本来是hbase
            hiveList=data;
            that.setState();
        });
    }

    /**
     * 获取数据库
     */
    queryDatabase()
    {
        Ajax.listHbaseDatabase(this.state,(data) => {
            dataBaseList=data;
            that.setState();
        });
    }

    /**
     * 获取数据表
     */
    queryTables()
    {
       Ajax.listHbaseTable(this.state,(data) => {
            tableList=data;
            that.setState();
        });
    }

    /**
     * 获取列簇
     */
    queryColumnFamily()
    {
        Ajax.listHbaseColumnfamily(this.state,(data) => {
            columnFamilyList=data;
            that.setState();
        });
    }

    /**
     * 获取列
     */
    queryColumn()
    {
        Ajax.listHbaseColumn(this.state,(data) => {
            columnList=data;
            that.setState();
        });
    }

    /**
     * hive修改
     * @param dataField
     * @param evt
     */
    hiveChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryDatabase();
    }

    /**
     * 数据库修改
     * @param dataField
     * @param evt
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
     * 列簇修改
     * @param dataField
     * @param evt
     */
    columnFamilyChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryColumn();
    }

    /**
     * 处理修改
     * @param dataField
     * @param evt
     */
    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.state[dataField]=value;
        this.setState();
    }

    /**
     * 验证
     * @returns {*}
     */
    doVaildate(){
        return that.refs.form.validate(that.state);
    }

    /**
     * 获取数据
     * @returns {*}
     */
    getData(){
        return that.state;
    }

    /**
     * 获取权限对象
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
        let databaseForm;
        if(this.props.operatorType=="userRoleDetail")
        {
            databaseForm=  <MultipleSelect values={that.state.database}  className="common-select" tagable disabled={this.props.disabled}
                                           onChange={this.tableChange.bind(this,'database')}>
                {/**tableList.map((item,index)=>{return (<Option key={item} value={item}>{item}</Option>)})**/}
            </MultipleSelect>
        }
        else
        {
            databaseForm=  <Select  value={this.state.database} className="common-select" disabled={this.props.disabled} onChange={this.dataBaseChange.bind(this,"database")} placeholder="请选择">
                {dataBaseList.map((item,index)=>{return (<Option2 key={item} value={item}>{item}</Option2>)})}
            </Select>
        }
        return (
            <div className="p-container" style={{marginLeft:40}}>
                <Form ref="form" rules={this.rules}>
                    <FormItem label="策略名称"   required name="policyName">
                        <RestrictInput type="text" className="form-control common-form-input" disabled={this.props.disabled}
                                       onChange={this.handleChange.bind(this,"policyName")} value={this.state.policyName}
                                       //restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                                       //tipString="只能输入字母、数字、下划线，长度不超过64个字符"
                                       maxLength="64"
                        />
                    </FormItem>
                    <FormItem label="Hbase源" name="resourceId" required>
                        <Select value={this.state.resourceId} className="common-select" disabled={this.props.disabled} onChange={this.hiveChange.bind(this,"resourceId")} placeholder="请选择">
                            {hiveList.map((item,index)=>{return (<Option2 key={item.id} value={item.id}>{item.name}</Option2>)})}
                        </Select>
                    </FormItem>
                    <FormItem label="命名空间"  required name="database">
                        {databaseForm}
                    </FormItem>
                    <FormItem label="表名" required name="table">
                        <MultipleSelect values={that.state.table}  className="common-select" tagable disabled={this.props.disabled}
                                        onChange={this.tableChange.bind(this,'table')}>
                            {tableList.map((item,index)=>{return (<Option key={item} value={item}>{item}</Option>)})}
                        </MultipleSelect>
                    </FormItem>
                    <FormItem label="列簇" required name="column-family">
                        <MultipleSelect values={that.state["column-family"]}  className="common-select" tagable disabled={this.props.disabled}
                                        onChange={this.handleChange.bind(this,'column-family')}>
                            {columnFamilyList.map((item,index)=>{return (<Option key={item} value={item}>{item}</Option>)})}
                        </MultipleSelect>
                    </FormItem>
                    <FormItem label="列名" required name="column">
                        <MultipleSelect values={that.state.column}  className="common-select" tagable disabled={this.props.disabled}
                                        onChange={this.handleChange.bind(this,'column')}>
                            {/**columnList.map((item,index)=>{return (<Option key={item.id} value={item.id}>{item.value}</Option>)})**/}
                        </MultipleSelect>
                    </FormItem>
                    <FormItem label="权限类型" required name="authorityList">
                        <CheckBoxAll ref="accessesBox" key="type" value="type" list={this.state.accesses} checkedField="isAllowed" disabled={this.props.disabled}/>
                    </FormItem>
                    <FormItem label="描述"  name="description">
                        <textarea  rows="4" className="form-control common-form-input"  style={{height:80}} onChange={this.handleChange.bind(this,"description")} disabled={this.props.disabled}/>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default HbaseBaseWin;
