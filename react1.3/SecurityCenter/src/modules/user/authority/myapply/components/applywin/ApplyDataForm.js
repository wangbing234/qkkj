/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:我的申请表单页面
 *
 ***************************************************/
import React from 'react';
import TableTree from 'bfd-ui/lib/TableTree'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import {RestrictInput,RestrictConst} from 'CommonComponent'
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import   RegularConst from "CommonComponent/utils/RegularConst"
import { Select2 ,Option2} from 'bfd-ui/lib/Select2'
import DatePicker from 'bfd-ui/lib/DatePicker'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import Ajax from  '../../ajax/AjaxReq'
import { MultipleSelect} from 'bfd-ui/lib/MultipleSelect'
import ConstUtil from  '../../../../../common/model/ConstUtil'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
const AUTH_TYPE=[{name:"功能权限",value:0},{name:"数据权限",value:1},{name:"资源权限",value:2}];
let hiveList=[];

class ApplyDataForm extends React.Component {
    constructor(prop) {
        super(prop);
        let approveObject = JSON.parse(this.props.data.approveDetails);//转换过的json
        this.state = {...this.props.data,who:"----",accesses:[],...approveObject}
        this.disabled= {disabled:true};
        //数据权限
        if(this.state.applyType==1 )
        {
            if(this.state.resourceType=="hive" && this.props.viewType!="telantSp")//hive
            {
                this.state.accesses=$.extend(true,[],ConstUtil.ACCESSES_DATA_HIVE);
                this.handerAccess();
            }
            else if(this.state.resourceType=="hbase" && this.props.viewType!="telantSp")//hbase
            {
                this.state.accesses=$.extend(true,[],ConstUtil.ACCESSES_DATA_HBASE);
                this.handerAccess();
            }
            else if(this.state.resourceType=="hdfs")//hdfs
            {
                this.state.accesses=$.extend(true,[],ConstUtil.ACCESSES_DATA_HDFS);
                this.handerAccess();
            }
        }

        this.rules = {
            applyName: value => {
                return BaseValidate.validateInput({isRequired: true, label: "申请名称", value: value, minLength: 4});
            },
            applyType: value => {
                return BaseValidate.validateInput({isRequired:true,label:"申请类型",value:(value=="请选择"?"":value)});
            }
        };

        this.columns = [
            {
                title: "功能名称",
                key:"checked",
                render(item,path) {
                    return <Checkbox checked={item.checked} disabled={true}>{item.name}</Checkbox>
                }
            }
            //, {
            //    title: "授权状态",
            //    key:"authStatus",
            //    render(text) {
            //        var renderText = "";
            //        switch (text.authStatus) {
            //            case 0:
            //                renderText = <span style={{color:'#BCBCBC'}}>已授权</span>;
            //                break;
            //            case 1:
            //                renderText = <span style={{color:'#006600'}}>待审批</span>;
            //                break;
            //            case 2:
            //                renderText = <span style={{color:'#000000'}}>未授权</span>;
            //                break;
            //            default:
            //                renderText = <span style={{color:'#000000'}}>未授权</span>;
            //                break;
            //        }
            //        return renderText;
            //    }
            //}
        ];

        this.breadArr = [{
            text: '我的申请',
            url: ''//如果不需要跳转url可以为空或不写url
        }, {
            text: '查看详情',
            url: ''
        }];
    }

    componentDidMount() {
        this.queryResource();
    }

    /**
     * 处理权限类型选择状态
     */
    handerAccess():void
    {
            this.state.accesses.map((item1,index)=>{
                this.state.authorityList.map((item,index)=>{
                    if(item1.type == item.type && item.isAllowed)
                    {
                        item1.isAllowed=true;
                        return;
                    }
                });
            });
    }

    /**
     * 公用处理修改
     * @param key
     * @param select
     */
    changeHandler(key, select) {
        let newState = this.state.selectData;
        if (select.target) {
            newState[key] = select.target.value;
        } else {
            newState[key] = select;
        }
        this.setState({selectData: newState})
    }

    /**
     * 返回列表页面
     */
    goBackHancler() {
        this.props.mainPage.setState({viewType:0});
    }

    /**
     * 查询资源
     */
    queryResource()
    {
             if(this.state.applyType==1 && (this.state.resourceType=="hive" || this.state.resourceType=="hbase"))
             {
                 let that=this;
                 Ajax.listHiveResource(this.state.resourceType,(data) => {
                     hiveList=data;
                     that.setState();
                 })
             }
    }

    /**
     * 获取批准表单
     * @returns {XML}
     */
    getApprovalForm()
    {
        return (<div>
                    <div className="row">
                        <div className="col-md-4">
                            <FormItem  label="审批人" name="approverName" required>
                                <input className="form-control common-form-input apply-short-form-input" type="text"
                                       value={this.state.approverName}  {...this.disabled}/>
                            </FormItem>
                        </div>
                        <div className="col-md-6">
                            <FormItem  label="审批时间"  name="approveTime">
                                <input className="form-control common-form-input apply-short-form-input" type="text"
                                       value={this.state.approveTime}  {...this.disabled} />
                            </FormItem>
                        </div>
                    </div>
                    <FormItem label="审批意见" name="approveOpition">
                        <RestrictTextarea  className="form-control common-textarea apply-long-form-input" {...this.disabled}  value={this.state.approveOpition}/>
                    </FormItem>
                </div>);
    }

    /**
     * 获取数据权限的表单
     * @param type
     * @returns {XML}
     */
    getDataFunctionFormByType(type)
    {
        if(this.state.applyType!=1)
        {
            return null;
        }
        if(this.state.resourceType=="hdfs")
        {
            return this.getHdfsForm();
        }

        let  columnFamily;
        let  columnFamilyColumn;
        let  columnDiv;
        let isHbaseBoolean=(type && "hbase"==type.toLowerCase());
        let signDataType=isHbaseBoolean?"HBase":"Hive";
        if(!(this.state.database instanceof  Array))
        {
            this.state.database=[this.state.database];
        }
        //租户是粗粒度的，没有这些
        if(this.props.viewType!="telantSp")
        {
            if(isHbaseBoolean)
            {
                columnFamily=<FormItem label="列簇" required name="column-family">
                                <MultipleSelect values={this.state.columnFamily}  className="common-select apply-long-form-input" {...this.disabled} tagable>
                                </MultipleSelect>
                            </FormItem>

                columnFamilyColumn=<FormItem label="列名" required name="column">
                    <MultipleSelect values={this.state.column}  className="common-select apply-long-form-input" tagable {...this.disabled}>
                    </MultipleSelect>
                </FormItem>
            }
            else {
                columnFamily=<FormItem label="列名" required name="column">
                                    <MultipleSelect values={this.state.column}  className="common-select apply-long-form-input" tagable {...this.disabled}>
                                    </MultipleSelect>
                                </FormItem>
            }

            columnDiv=<div>
                            <FormItem label="表名" required name="table">
                                <MultipleSelect values={this.state.table}  className="common-select apply-long-form-input" tagable {...this.disabled}/>
                            </FormItem>
                            {columnFamily}
                             {columnFamilyColumn}
                            <FormItem label="权限类型" required name="authorityList">
                                <CheckBoxAll ref="accessesBox" key="type" value="type" list={this.state.accesses} checkedField="isAllowed" {...this.disabled}/>
                            </FormItem>
                        </div>
        }

        return <div>
                    <FormItem label={signDataType+"源"}  name="resourceId" required>
                        <Select2 value={this.state.resourceId} className="common-select apply-long-form-input"  placeholder="请选择" {...this.disabled}>
                            {hiveList.map((item,index)=>{return (<Option2 key={item.id} value={item.id}>{item.name}</Option2>)})}
                        </Select2>
                    </FormItem>
                    <FormItem label="数据库名"  required name="database">
                        <MultipleSelect values={this.state.database}  className="common-select apply-long-form-input" tagable {...this.disabled}/>
                    </FormItem>
                         {columnDiv}
                    <FormItem label="描述"  name="description">
                        <RestrictTextarea   className="form-control common-textarea apply-long-form-input" value={this.state.description}  {...this.disabled}/>
                    </FormItem>
              </div>
    }

    /**
     * 获取hdfs相关表单
     * @param type
     * @returns {XML}
     */
    getHdfsForm()
    {
          return <div>
                      <FormItem label="文件目录" name="path" required>
                          <MultipleSelect values={this.state.path} className="common-select apply-long-form-input" tagable {...this.disabled}/>
                      </FormItem>
                      <FormItem label="权限类型" required name="authorityList">
                          <CheckBoxAll ref="accessesBox" key="type" value="type" list={this.state.accesses} checkedField="isAllowed" {...this.disabled}/>
                      </FormItem>
                      <FormItem label="描述" name="description">
                          <RestrictTextarea  className="form-control common-textarea apply-long-form-input"   {...this.disabled}/>
                      </FormItem>
                  </div>
    }


    render() {
        let form_Approval_Form;
        let function_content_Form;
        let statusString;
        if(this.state.status==0)
        {
            statusString=<span>待审批</span>;
        }
        else if(this.state.status==1){
            statusString=<span>同意</span>;
        }
        else if(this.state.status==2){
            statusString=<span style={{color:"#ff0000"}}>{this.state.who}拒绝</span>;
        }
        if(this.state.status!=0){//如果不是待审批
            form_Approval_Form= this.getApprovalForm();
        }

        if(this.state.applyType==0 || this.state.applyType==2)//如果是功能或资源权限
        {
            let approveDetails=JSON.parse(this.state.approveDetails);
            function_content_Form= (<FormItem  label="申请内容" name="DataTable">
                                         <TableTree columns={this.columns} data={approveDetails}/>
                                   </FormItem>);
        }

        return (
            <EditPanel history={this.props.history} breadCrumbList={this.breadArr} onChange={this.goBackHancler.bind(this)}>
            <div className="apply_data_table">
                <span className="apply_Title">审批状态:{statusString}</span>
                <Form ref="form" rules={this.rules} style={{marginTop:20}}>
                    <div className="row">
                        <div className="col-md-4">
                            <FormItem label="申请名称"  name="applyName">
                                <input className="form-control common-form-input apply-short-form-input"   type="text" {...this.disabled}
                                       value={this.state.applyName}/>
                            </FormItem>
                        </div>
                        <div className="col-md-6" style={{marginLeft:'20px'}}>
                            <FormItem label="申请人"  name="applyerName">
                                <input className="form-control common-form-input apply-short-form-input" type="text"
                                       value={this.state.applyerName} {...this.disabled} />
                            </FormItem>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <FormItem  label="申请类型" name="applyType" required>
                                <Select2 value={this.state.applyType} className="common-select apply-short-form-input" {...this.disabled}>
                                    {AUTH_TYPE.map((item,index)=>{return (<Option2 key={item.value} value={item.value}>{item.name}</Option2>)})}
                                </Select2>
                            </FormItem>
                        </div>
                        <div className="col-md-6" style={{marginLeft:'20px'}}>
                            <FormItem  label="申请时间"  name="applyTime">
                                <input className="form-control common-form-input apply-short-form-input" type="text" {...this.disabled}
                                       value={this.state.applyTime} {...this.disabled}
                                       />
                            </FormItem>
                        </div>
                    </div>
                    {this.getDataFunctionFormByType(this.state.resourceType)}
                    <FormItem label="申请理由" name="applyReason">
                        <RestrictTextarea   className="form-control common-textarea apply-long-form-input"   {...this.disabled}  value={this.state.applyReason}/>
                    </FormItem>
                      {function_content_Form}
                      {form_Approval_Form}
                </Form>
                <button className="btn btn-default" type="button" style={{marginLeft:100}} onClick={this.goBackHancler.bind(this)}>返回</button>
            </div>
                </EditPanel>
        )
    }
}
export default  ApplyDataForm
