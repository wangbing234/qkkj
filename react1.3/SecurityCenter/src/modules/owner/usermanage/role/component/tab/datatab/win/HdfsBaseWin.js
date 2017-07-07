/***************************************************
 * 时间: 2016/7/21 16:11
 * 作者: bing.wang
 * 说明: hdfs编辑页面
 *
 ***************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import {RestrictInput,RestrictConst} from 'CommonComponent'
import   RegularConst from "CommonComponent/utils/RegularConst"
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import ConstUtil from  '../../../../../../../common/model/ConstUtil'
import CommonUtil from 'CommonComponent/utils/CommonUtil'
import CommonUtils from  '../../../../../../../common/component/CommonUtils'
import Ajax from '../../../../ajax/AjaxReq'
var that;
let hiveList=[];

class HdfsBaseWin extends React.Component{
    constructor(prop){
        super(prop);
        let baseData={ "id":0, "resourceType": "hdfs", "createUser": "jupiter",
            "updateUser": "jupiter",
            "createTime": 1464317482000,
            "updateTime": 1465366331000, accesses:$.extend(true,[],ConstUtil.ACCESSES_DATA_HDFS)}
        if(this.props.data)
        {
            this.newAccesses=this.props.data.accesses;
            delete  this.props.data.accesses;
        }
        this.state={...baseData,...this.props.data};
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
            path: value => {
                let _errorString=BaseValidate.validateInput({isRequired:true,label:"文件目录",value:(value=="请选择"?"":value)});
                if(!_errorString) {
                    _errorString = CommonUtils.vaildateHdfsPath(value);
                }
                return _errorString;
            } ,
            description: value => {
                return BaseValidate.validateInput({isRequired:false,label:"描述",value});
            },
            authorityList: value => {
                let msg ="";
                let selectStr = CommonUtil.fifterArrayByValue(this.state.accesses,"isAllowed",true);
                if(selectStr.length == 0){
                    msg = '授权对象不能为空!'
                }
                return msg;
            },
        };

        this.oldPolicyName=this.state.policyName;
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
     * 验证
     * @returns {*}
     */
    doVaildate(){
        return that.refs.form.validate(that.state);
    }

    componentDidMount() {
        this.handerAccess();
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
        return (
            <div className="p-container" style={{marginLeft:40}}>
                <Form ref="form" rules={this.rules}>
                    <FormItem label="策略名称"   required name="policyName">
                        <RestrictInput type="text" className="form-control common-form-input" disabled={this.props.disabled}
                                       onChange={this.handleChange.bind(this,"policyName")}  value={this.state.policyName}
                                       //restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_64}
                                       //tipString="只能输入字母、数字、下划线，长度不超过64个字符"
                                       maxLength="64"
                        />
                    </FormItem>
                    <FormItem label="文件目录" name="path" required ref="path">
                        <MultipleSelect values={that.state.path}  className="common-select" tagable disabled={this.props.disabled}
                                        onChange={this.handleChangePath.bind(this,'path')}>
                            {hiveList.map((item,index)=>{return (<Option key={item.id} value={item.id}>{item.value}</Option>)})}
                        </MultipleSelect>
                    </FormItem>

                    <FormItem label="权限类型" required name="authorityList">
                        <CheckBoxAll ref="accessesBox" key="type" value="type" type="hdfs"  disabled={this.props.disabled} list={this.state.accesses} checkedField="isAllowed"/>
                    </FormItem>
                    <FormItem label="描述"  name="description">
                        <textarea  rows="4" className="form-control" className="form-control common-form-input" style={{height:80}}  disabled={this.props.disabled} onChange={this.handleChange.bind(this,"description")}/>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default HdfsBaseWin;
