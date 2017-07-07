/***************************************************
 * 时间: 2016/7/21 16:11
 * 作者: bing.wang
 * 说明: hvie编辑页面
 *
 ***************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import {RestrictInput,RestrictConst} from 'CommonComponent'
import   RegularConst from "CommonComponent/utils/RegularConst"
import Ajax from '../../../../ajax/AjaxReq'
import { Select ,Option2} from 'bfd-ui/lib/Select2'
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import ConstUtil from  '../../../../../../../common/model/ConstUtil'
var that;
let hiveList=[];
let dataBaseList=[];
let tableList=[];
let columnList=[];
class Hive extends React.Component{
    constructor(prop){
        super(prop);
        let baseData={ "id":0, "resourceType": "hive", "createUser": "jupiter",
            "updateUser": "jupiter",
            "createTime": 1464317482000,
            "updateTime": 1465366331000, accesses:$.extend(true,[],ConstUtil.ACCESSES_DATA_HIVE)}
        if(this.props.data)
        {
            this.newAccesses=this.props.data.accesses;
            delete  this.props.data.accesses;
        }

        this.state={...baseData,...this.props.data};
        if(this.state.database && this.state.database  instanceof Array && this.props.operatorType!="userRoleDetail")
        {
            this.state.database=this.state.database[0]
        }
        let that=this;
        this.rules = {
            policyName: value => {
               let resultStringpolicyName= BaseValidate.validateInput({isRequired: true, label: "策略名称", value: value, maxLength:64});
                if(!resultStringpolicyName &&  that.oldPolicyName!=value)
                {
                    Ajax.isExistPolicyName({policyName:value,type:that.state.resourceType},(data)=>{
                        if(data.data==true)
                            resultStringpolicyName=data.msg;
                    });
                }
                return resultStringpolicyName;
            },
            resourceId: value => {
                return BaseValidate.validateInput({isRequired:true,label:"Hive源",value:(value=="请选择"?"":value)});
            } ,
            database: value => {
                return BaseValidate.validateInput({isRequired:true,label:"数据库名",value:(value=="请选择"?"":value)});
            },
            table: value => {
                return BaseValidate.validateInput({isRequired:true,label:"表名称",value:(value=="请选择"?"":value)});
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

    handerAccess():void
    {
        if(this.newAccesses)
        {
            this.state.accesses.map((item1,index)=>{
                this.newAccesses.map((item,index)=>{
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

    componentDidMount() {
        if(this.props.data && this.props.data.policyName)
        {
            this.queryResource();
            this.queryDatabase();
            this.queryTables();
            this.queryColumn();
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
        Ajax.listPolicyResourceByType({type:"hive"},(data) => {
            hiveList=data;
            that.setState();
        });
    }

    /**
     * 获取数据库
     */
    queryDatabase()
    {
        Ajax.listHiveDatabase(this.state,(data) => {
            dataBaseList=data;
            that.setState();
        });
    }

    /**
     * 获取表
     */
    queryTables()
    {
        Ajax.listHiveTable(this.state,(data) => {
            tableList=data;
            that.setState();
        });
    }

    /**
     * 获取列
     */
    queryColumn()
    {
        Ajax.listHiveColumn(this.state,(data) => {
            columnList=data;
            that.setState();
        });
    }

    /**
     * 公用修改
     * @param dataField
     * @param evt
     */
    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.state[dataField]=value;
        this.setState();
    }

    /**
     * hive修改
     * @param dataField
     * @param evt
     */
    hiveChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryDatabase(evt);
    }

    /**
     * 数据库修改
     * @param dataField
     * @param evt
     */
    dataBaseChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryTables(evt);
    }

    /**
     * 表修改
     * @param dataField
     * @param evt
     */
    tableChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryColumn(evt);
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
        else {
            databaseForm=  <Select  value={this.state.database} className="common-select" disabled={this.props.disabled} onChange={this.dataBaseChange.bind(this,"database")} placeholder="请选择">
                {dataBaseList.map((item,index)=>{return (<Option2 key={item} value={item}>{item}</Option2>)})}
            </Select>
        }
        return (
            <div className="p-container" style={{marginLeft:40}}>
                <Form ref="form" rules={this.rules}>
                    <FormItem label="策略名称"   required name="policyName">
                        <RestrictInput type="text" className="form-control common-form-input"
                                       onChange={this.handleChange.bind(this,"policyName")}
                                       value={this.state.policyName}   disabled={this.props.disabled}
                                       maxLength="64"
                                       //restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                                       //tipString="只能输入字母、数字、下划线，长度不超过64个字符"
                        />
                    </FormItem>
                    <FormItem label="Hive源"  name="resourceId" required>
                        <Select value={this.state.resourceId} className="common-select" disabled={this.props.disabled} onChange={this.hiveChange.bind(this,"resourceId")} placeholder="请选择">
                            {hiveList.map((item,index)=>{return (<Option2 key={item.id} value={item.id}>{item.name}</Option2>)})}
                        </Select>
                    </FormItem>
                    <FormItem label="数据库名"  required name="database">
                        {databaseForm}
                    </FormItem>
                    <FormItem label="表名" required name="table">
                        <MultipleSelect values={that.state.table}  className="common-select" tagable disabled={this.props.disabled}
                                        onChange={this.tableChange.bind(this,'table')}>
                            {tableList.map((item,index)=>{return (<Option key={item} value={item}>{item}</Option>)})}
                        </MultipleSelect>
                    </FormItem>
                    <FormItem label="列名" required name="column">
                        <MultipleSelect values={that.state["column"]}  className="common-select" tagable disabled={this.props.disabled}
                                        onChange={this.handleChange.bind(this,'column')}>
                            {columnList.map((item,index)=>{return (<Option key={item} value={item}>{item}</Option>)})}
                        </MultipleSelect>
                    </FormItem>

                    <FormItem label="权限类型" required name="authorityList">
                        <CheckBoxAll ref="accessesBox" key="type" value="type" disabled={this.props.disabled} list={this.state.accesses} checkedField="isAllowed"/>
                    </FormItem>
                    <FormItem label="描述"  name="description">
                        <textarea  rows="4" className="form-control common-form-input" disabled={this.props.disabled} value={this.state.description} style={{height:80}} onChange={this.handleChange.bind(this,"description")}/>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Hive;
