import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import TenantBaseInfo from '../common/TenantBaseInfo.jsx'
import TenantOwner from '../common/TenantOwner.jsx'
import SeeAuthorityFun from '../common/SeeAuthorityFun'
import SeeAuthorityData from '../common/SeeAuthorityData'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
let breadArr = [{
    text: '租户管理',
    url:''//如果不需要跳转url可以为空或不写url
},{
    text: '查看租户',
    url:''
}];
const roleArr = [
    {id: 1, name: '管理员'},
    {id: 2, name: '其它'}
];

class SeeTenant extends React.Component {

    constructor(prop) {
        super(prop);
        this.state = {};
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
        if (this.refs.form.validate(this.state)) {
            console.log('表单验证通过');
            //验证通过
            this.props.saveClick(this.state);
        } else {
            console.log('表单验证失败');
        }
    }

    render() {
        return (<div>
            <EditPanel history={this.props.history} breadCrumbList={breadArr} onChange={this.props.cancel}>
                <FormCategory>
                    <FormCategoryItem name="租户基本信息">
                        <TenantBaseInfo data={this.props.tenantData} disabled={true}/>
                    </FormCategoryItem>
                    <FormCategoryItem name="租户所有者">
                        <TenantOwner data={this.props.ownerData} disabled={true}/>
                    </FormCategoryItem>
                    <FormCategoryItem name="功能权限">
                        <SeeAuthorityFun roleId={this.props.roleId} tenantId={this.props.tenantData.id}/>
                    </FormCategoryItem>
                    <FormCategoryItem name="数据授权">
                        <SeeAuthorityData roleId={this.props.roleId} tenantId={this.props.tenantData.id}/>
                    </FormCategoryItem>
                </FormCategory>
                <button type="button" className="btn btn-sm btn-default" style={{marginLeft:'244px'}} onClick={this.props.cancel}>取消</button>
            </EditPanel>

            </div>
        );
    }
}

export default SeeTenant;