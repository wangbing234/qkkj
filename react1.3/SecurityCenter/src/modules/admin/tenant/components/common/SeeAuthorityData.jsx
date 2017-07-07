import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import FunctionAuthority from './FunctionAuthority.jsx'
import ResourceAuthority from './ResourceAuthority.jsx'
import SeeDataAuthority from './SeeDataAuthority.js'

class SeeAuthority extends React.Component {
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
        return (<div className="tenantmanage-admin"  style={{paddingLeft:55}}>
                        <SeeDataAuthority tenantId={this.props.tenantId}/>
                 </div>
        );
    }
}

export default SeeAuthority;