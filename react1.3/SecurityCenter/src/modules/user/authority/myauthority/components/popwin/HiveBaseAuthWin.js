/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:hive我的权限页面
 *
 ***************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import {RestrictInput,RestrictConst} from 'CommonComponent'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import   RegularConst from "CommonComponent/utils/RegularConst"
import   Ajax from  "../../ajax/AjaxReq"
import { Select ,Option2} from 'bfd-ui/lib/Select2'
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import ConstUtil from  '../../../../../common/model/ConstUtil'
var that;
let hiveList=[];
let dataBaseList=[];
let tableList=[];
let columnList=[];
let newAccesses=[];
class Hive extends React.Component{
    constructor(prop){
        super(prop);
        let baseData={ "id":0, "resourceType": "hive", "createUser": "jupiter",
            "updateUser": "jupiter",
            "createTime": 1464317482000,
            "updateTime": 1465366331000, accesses:$.extend(true,[],ConstUtil.ACCESSES_DATA_HIVE)}
        if(this.props.data)
        {
            newAccesses=this.props.data.accesses;
            delete  this.props.data.accesses;
        }
        let thisState={...baseData,...this.props.data};
        if(!thisState.table)
            thisState.table=["*"];
        if(!thisState.column)
            thisState.column=["*"];

        this.state=thisState;
        this.rules = {
            applyName: value => {
                return BaseValidate.validateInput({isRequired: true, label: "申请名称", value: value,maxLength:64});
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
            applyReason: value => {
                return BaseValidate.validateInput({isRequired:false,label:"描述",value,maxLength:255});
            },
            accesses: value => {//验证有些问题
                let msg ='权限类型不能为空';
                value.map((item,index)=>{
                    if(item.isAllowed == true){
                        msg = ''
                    }
                });
                return msg;
            }
        };
    }

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

    componentDidMount() {
        if(this.props.data)
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
     * 查询资源
     */
    queryResource()
    {
        Ajax.listHiveResource("hive",(data) => {
            hiveList=data;
            that.setState({});
        })
    }

    /**
     * 查询数据库
     */
    queryDatabase()
    {
        Ajax.hiveTenantNameSpaces(this.state,(data) => {
            dataBaseList=data;
            that.setState({});
        })
    }

    /**
     * 查询数据表
     */
    queryTables()
    {
        Ajax.listHiveTable(this.state,(data) => {
            tableList=data;
            that.setState({});
        })
    }

    /**
     * 查询列
     */
    queryColumn()
    {
        Ajax.listHiveColumn(this.state,(data) => {
            columnList=data;
            that.setState({});
        })
    }

    /**
     *修改处理
     * @param dataField
     * @param evt
     */
    handleChange(dataField, evt) {
        let value = evt && evt.target?evt.target.value:evt;
        this.state[dataField]=value;
        this.setState({});
    }

    /**
     *公用修改状态
     */
    hiveChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryDatabase(evt);
    }

    /**
     *数据库修改状态
     */
    dataBaseChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryTables(evt);
    }

    /**
     * 数据库修改
     * @param dataField
     * @param evt
     */
    tableChange(dataField, evt) {
        that.handleChange(dataField,evt);
        that.queryColumn();
    }

    /**
     *验证方法
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
                    <FormItem label="Hive源"  name="resourceId" required>
                        <Select value={this.state.resourceId} className="common-select" onChange={this.hiveChange.bind(this,"resourceId")} placeholder="请选择">
                            {hiveList.map((item,index)=>{return (<Option2 key={item.id} value={item.id}>{item.name}</Option2>)})}
                        </Select>
                    </FormItem>
                    <FormItem label="数据库名"  required name="database">
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
                    <FormItem label="列名" required name="column">
                        <MultipleSelect values={that.state["column"]}  className="common-select" tagable
                                        onChange={this.handleChange.bind(this,'column')}>
                            {columnList.map((item,index)=>{return (<Option key={item} value={item}>{item}</Option>)})}
                        </MultipleSelect>
                    </FormItem>

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

export default Hive;
