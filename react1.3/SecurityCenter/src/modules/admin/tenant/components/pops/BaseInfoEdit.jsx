import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import message from 'CommonComponent/component/bdosmessage'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import FormFooter from 'CommonComponent/component/formfooter'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import TenantBaseInfo from '../common/TenantBaseInfo.jsx'
import AjaxReq from '../../model/AjaxReq'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
let breadArr = [{
    text: '租户管理',
    url:''//如果不需要跳转url可以为空或不写url
},{
    text: '编辑租户',
    url:''
}];
const roleArr = [
    {id: 1, name: '管理员'},
    {id: 2, name: '其它'}
];

class BaseInfoEdit extends React.Component {

    constructor(prop) {
        super(prop);
        this.state = {
            ...this.props.data
        };
    }

    handleChange(dataField, evt) {
        this.setState({[dataField]: evt.target.value});
    }

    handleSelectChange(dataField, value) {
        this.setState({[dataField]: value});
    }

    //submit按钮提交操作
    handleSubmit(e) {
        if (e) {
            e.preventDefault()
        }
        if (this.refs.tenantBaseInfo.validate()) {
            console.log('表单验证通过');
            //验证通过调用后台保存
            this.saveBaseInfo();
        } else {
            console.log('表单验证失败');
        }
    }

    saveBaseInfo(){
        let data = {tenant:this.refs.tenantBaseInfo.getFormData()};//接口有问题
        AjaxReq.editTenantBaseInfo(`data=${JSON.stringify(data)}`,(result)=>{
            message.success("租户基本信息编辑成功");
            this.props.cancel();
        })
    }

    render() {
        return (<div>
              <EditPanel history={this.props.history} breadCrumbList={breadArr} onChange={this.props.cancel}>
                <FormCategory>
                    <FormCategoryItem name="租户基本信息">
                        <TenantBaseInfo ref="tenantBaseInfo" data={this.state} isEdit={true}/>
                    </FormCategoryItem>
                </FormCategory>
                <FormFooter style={{marginLeft:'270px'}} submitClick={this.handleSubmit.bind(this)}
                            cancelClick={this.props.cancel}/>
                  </EditPanel>
            </div>
        );
    }
}

export default BaseInfoEdit;