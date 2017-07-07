/***************************************************
 * 时间: 2016/7/21 16:53
 * 作者: bing.wang
 * 说明: 申请表单
 *
 ***************************************************/
import React from 'react'
import { Checkbox ,CheckboxGroup} from 'bfd-ui/lib/Checkbox'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select2 ,Option2} from 'bfd-ui/lib/Select2'
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import {RestrictInput,RestrictConst} from 'CommonComponent'
import   RegularConst from "CommonComponent/utils/RegularConst"
import Ajax from '../../ajax/AjaxReq'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import CommonUtils from  '../../../../../common/component/CommonUtils'
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import ConstUtil from  '../../../../../common/model/ConstUtil'
let that;
let hiveList=[];
let dataBaseList=[];

class DataAuthorityForm extends React.Component {
    constructor(prop) {
        super(prop);
        that = this;
        this.accesses=$.extend(true,[],ConstUtil.ACCESSES_DATA_HDFS);
        let propsData={};
        let  baseData={resourceType:this.props.dbType};
        if(this.props.data)
        {
            propsData= $.extend({},this.props.data,true)
            this.newAccesses=this.accesses;
            delete  propsData.accesses;
        }
        this.state={...baseData,...propsData};
        this.handerAccess();
        this.rules = {
            policyName: value => {
                return BaseValidate.validateInput({isRequired: false, label: "策略名称", value: value,maxLength:64});
            },
            applyName: value => {
                return BaseValidate.validateInput({isRequired: true, label: "申请名称", value: value, minLength: 4,maxLength:16});
            },
            resourceId: value => {
                return BaseValidate.validateInput({isRequired:true,label:"Hive源",value:(value=="请选择"?"":value)});
            },
            path: value => {
                let _errorString= BaseValidate.validateInput({isRequired:true,label:"文件目录",value:(value=="请选择"?"":value)});
                if(!_errorString) {
                    _errorString = CommonUtils.vaildateHdfsPath(value);
                }
                return _errorString;
            } ,
            database: value => {
                let resultName=BaseValidate.validateInput({isRequired:true,label:"数据库名",value:(value=="请选择"?"":value)});
                if(!resultName) {
                    Ajax.checkIfExists({databases: '["'+value.join('","')+'"]', resourceType: that.props.dbType.toLowerCase()}, (data)=> {
                        resultName=(data.data.status)?"":data.data.msg;
                    })
                }
                return resultName;
            }
        };
    }

    componentDidMount() {
        this.queryResource();
    }


    /**
     * 权限类型处理
     */
    handerAccess():void
    {
            this.accesses.map((item1,index)=> {
                    if (this.newAccesses) {
                        item1.isAllowed = false;
                        this.newAccesses.map((item, index)=> {
                            if (item1.type == item.type && item.isAllowed) {
                                item1.isAllowed = true;
                                return;
                            }
                        });
                    }
                    else {
                        item1.isAllowed = false;
                    }
                }
            );
            this.setState();

    }

    /**
     * 根据资源查询数据库
     */
    listHiveatabase()
    {
        Ajax.listHiveatabase(this.state,(data) => {
            dataBaseList=data;
            that.setState({});
        })
    }

    /**
     * 根据资源查询数据库
     */
    listHbaseDatabase()
    {
        Ajax.listHbaseDatabase(this.state,(data) => {
            dataBaseList=data;
            that.setState({});
        })
    }

    /**
     * 处理提交
     * @param e
     */
    handleSubmit(e) {
        e.preventDefault();
    }

    /**
     * hive修改
     * @param dataField
     * @param evt
     */
    hiveChange(dataField, e) {
        that.handleChange(dataField,e);
    }

    /**
     * hive修改
     * @param dataField
     * @param evt
     */
    dataBaseChange(dataField, e) {
        that.handleChange(dataField,e);
        that.refs.database.validate(this.state.database);
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
     * 公用修改
     * @param dataField
     * @param evt
     */
    handleChangePath(dataField, evt) {
        this.handleChange(dataField, evt);
        this.refs.path.validate(this.state.path)
    }

    /**
     * 查询资源
     */
    queryResource()
    {
        let dbType = this.props.dbType.toLowerCase()
        Ajax.listResourceByType(dbType,(data) => {
            hiveList=data;
            that.setState({});
        })
    }

    /**
     * 处理验证
     * @returns {*}
     */
    doVaildate(){
        return that.refs._form.validate(that.state);
    }

    /**
     * 获取数据
     * @returns {*}
     */
    getData(){
        let authApprove={};
        let DDetail;
        switch (this.props.dbType)
        {
            case "Hive":
            case "Hbase":{

                DDetail=  JSON.stringify({tenantId:window._currentUser.tenantId,resourceType:this.props.dbType.toLowerCase(),
                        resourceId:this.state.resourceId,database:this.state.database}),
                authApprove = {
                        applyName: this.state.applyName,
                        applyType: 1,
                        approveType:1,
                       details: DDetail,
                    applyReason: this.state.applyReason
                }
                break;
            }
            case "Hdfs":{
                 DDetail=  JSON.stringify({tenantId:window._currentUser.tenantId,resourceType:this.props.dbType.toLowerCase(),policyName:this.state.policyName,path:this.state.path,authorityList:this.accesses});
                authApprove = {
                    applyName: this.state.applyName,
                    applyType: 1,
                    approveType:1,
                    details: DDetail,
                    applyReason: this.state.applyReason
                }
                break;
            }
        }
        return authApprove;
    }

    render() {
        let applyName;
        let ownerItems;
        let dbType = this.props.dbType;
        let resouceTypeID;
        let dataBaseTypeID;
        let path;//hdfs独有
        let hdfsPolicName;//hdfs独有
        if(this.props.editorType=="1")
        {
            applyName=  <FormItem label="申请名称" required name="applyName">
                <RestrictInput type="text" className="form-control common-form-input"
                       value={this.state.applyName} onChange={this.handleChange.bind(this,"applyName")}/>
            </FormItem>
        }
        else {
            applyName=   <FormItem label="策略名称"   name="policyName">
                <RestrictInput type="text" className="form-control common-form-input"
                               onChange={this.handleChange.bind(this,"policyName")}  value={this.state.policyName}
                               //restrict={RestrictConst.NUM_START_STRING_UNDERLINE_64}
                               //tipString="只能输入字母、数字、下划线且必须以字母开头，长度小于64个字符"
                               maxLength="64"
                />
            </FormItem>
        }

        if(dbType!="Hdfs") {

            resouceTypeID = <FormItem label={this.props.dbType+"源"} required name="resourceId">
                                <Select2 value={this.state.resourceId} className="common-select" onChange={this.hiveChange.bind(this,"resourceId")}  placeholder="请选择">
                                    {hiveList.map((item,index)=>{return (<Option2 key={item.id} value={item.id}>{item.name}</Option2>)})}
                                </Select2>
                          </FormItem>;
            dataBaseTypeID=  <FormItem label="数据库名"  required name="database" ref="database">
                                <MultipleSelect  value={this.state.database} className="common-select" tagable  onChange={this.dataBaseChange.bind(this,"database")} placeholder="请选择">
                                    {dataBaseList.map((item,index)=>{return (<Option key={item} value={item}>{item}</Option>)})}
                                </MultipleSelect>
                            </FormItem>
        }
        else if(dbType=="Hdfs"){
                hdfsPolicName= <FormItem label="策略名称"  name="policyName">
                    <RestrictInput type="text" className="form-control common-form-input"
                                   onChange={this.handleChange.bind(this,"policyName")}  value={this.state.policyName}
                                   restrict={RestrictConst.NUM_START_STRING_UNDERLINE_64}
                                   tipString="只能输入字母、数字、下划线且必须以字母开头，长度小于64个字符"
                    />
                                </FormItem>
                path = <FormItem label="文件目录"  ref="path" name="path" required>
                            <MultipleSelect values={that.state.path}  className="common-select" tagable
                                            onChange={this.handleChangePath.bind(this,'path')}>
                                {hiveList.map((item,index)=>{return (<Option key={item.id} value={item.id}>{item.value}</Option>)})}
                            </MultipleSelect>
                        </FormItem>;

                ownerItems= <FormItem label="权限类型" required name="authorityList">
                                  <CheckBoxAll ref="accessesBox" key="type" type={dbType.toLowerCase()} value="type" list={this.accesses} checkedField="isAllowed"/>
                            </FormItem>
        }

        return (
            <div className="p-container">
                <Form  ref="_form" horizontal rules={this.rules} >
                    {applyName}
                    {hdfsPolicName}
                    {resouceTypeID}
                    {dataBaseTypeID}
                    {path}
                    <FormItem label="授权对象" required name="tenantName">
                        <input type="text" className="form-control common-form-input" disabled
                               value={window._currentUser.tenantName}/>
                    </FormItem>
                    {ownerItems}
                    <FormItem label="申请理由" name="applyReason">
                          <textarea className="form-control common-form-input" style={{height:80}} value={this.state.applyReason} onChange={this.handleChange.bind(this,"applyReason")}/>
                    </FormItem>
                </Form>
            </div>
        );
    }
}
export default  DataAuthorityForm;
