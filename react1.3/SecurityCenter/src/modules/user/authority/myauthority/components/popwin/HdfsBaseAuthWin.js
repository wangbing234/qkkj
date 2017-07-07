/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:hdfs我的权限页面
 *
 ***************************************************/
import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import {RestrictInput,RestrictConst} from 'CommonComponent'
import   RegularConst from "CommonComponent/utils/RegularConst"
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import { MultipleSelect, Option } from 'bfd-ui/lib/MultipleSelect'
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import ConstUtil from  '../../../../../common/model/ConstUtil'
import CommonUtils from  '../../../../../common/component/CommonUtils'
import   Ajax from  "../../ajax/AjaxReq"

var that;
let hiveList=[];
let newAccesses=[];
class Hbase extends React.Component{
    constructor(prop){
        super(prop);
        let baseData={ "id":0, "resourceType": "hdfs", "createUser": "jupiter",
            "updateUser": "jupiter",
            "createTime": 1464317482000,
            "updateTime": 1465366331000, accesses:$.extend(true,[],ConstUtil.ACCESSES_DATA_HDFS)}
        if(this.props.data)
        {
            newAccesses=this.props.data.accesses;
            delete  this.props.data.accesses;
        }
        this.state={...baseData,...this.props.data};
        this.rules = {
            applyName: value => {
                return BaseValidate.validateInput({isRequired: true, label: "申请名称", value: value,maxLength:64});
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
            path: value => {
                let _errorString= BaseValidate.validateInput({isRequired:true,label:"文件目录",value:(value=="请选择"?"":value)});
                if(!_errorString) {
                    _errorString = CommonUtils.vaildateHdfsPath(value);
                }
                if(!_errorString)
                {
                    Ajax.checkPermission({paths:"[\""+value.join("","")+"\"]"},(data)=>{
                        let _data=data.data;
                        if(_data.status==false)
                            _errorString=_data.msg;
                    })
                }
                return _errorString;
            } ,
            applyReason: value => {
                return BaseValidate.validateInput({isRequired:false,label:"描述",value,maxLength:255});
            }
        };
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
     * 公用验证
     * @param dataField
     * @param evt
     */
    doVaildate(){
        return that.refs.form.validate(that.state);
    }

    /**
     * 获取数据
     * @param dataField
     * @param evt
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
                                       onChange={this.handleChange.bind(this,"policyName")}  value={this.state.policyName}
                                       //restrict={RestrictConst.NUM_START_STRING_UNDERLINE_64}
                                       //tipString="只能输入字母、数字、下划线且必须以字母开头，长度小于64个字符"
                                       maxLength="64"
                        />
                    </FormItem>
                    <FormItem label="文件目录" ref="path" name="path" required>
                        <MultipleSelect values={that.state.path}  className="common-select" tagable
                                        onChange={this.handleChangePath.bind(this,'path')}>
                            {hiveList.map((item,index)=>{return (<Option key={item.id} value={item.id}>{item.value}</Option>)})}
                        </MultipleSelect>
                    </FormItem>

                    <FormItem label="权限类型" required name="accesses">
                        <CheckBoxAll ref="accessesBox" key="type" value="type" type="hdfs" list={this.state.accesses} checkedField="isAllowed"/>
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
