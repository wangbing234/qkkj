import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import TenantBaseInfo from '../common/TenantBaseInfo.jsx'
import TenantOwner from '../common/TenantOwner.jsx'


const roleArr = [
    {id: 1, name: '管理员'},
    {id: 2, name: '其它'}
];

class BaseInfo extends React.Component {

    constructor(prop) {
        super(prop);
        this.state = {};
    }

    validate(){
        let tenantBaseInfoSuccess = this.refs.tenantBaseInfo.validate();
        let tenantOwnerSuccess = this.refs.tenantOwner.validate();
        if(tenantBaseInfoSuccess && tenantOwnerSuccess){
            return true;
        }else {
            return false;
        }
    }

    getFormData(){
        let tenant = this.refs.tenantBaseInfo.state;
        let user = this.refs.tenantOwner.state;
        let baseInfo = {user:user,tenant:tenant};
        let data = `data=${JSON.stringify(baseInfo)}`;
        return data;
    }

    handleChange(dataField, evt) {
        this.setState({[dataField]: evt.target.value});
    }


    render() {
        return (<div>
                <FormCategory>
                        <FormCategoryItem name="租户基本信息">
                            <TenantBaseInfo ref="tenantBaseInfo"/>
                        </FormCategoryItem>
                        <FormCategoryItem name="租户所有者">
                            <TenantOwner ref="tenantOwner" isShowPwd = {true}/>
                        </FormCategoryItem>

                </FormCategory>
            </div>
        );
    }
}

export default BaseInfo;