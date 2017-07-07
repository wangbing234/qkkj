import React from 'react'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import FunctionAuthority from './FunctionAuthority.jsx'
import ResourceAuthority from './ResourceAuthority.jsx'
import SeeDataAuthority from './SeeDataAuthority.js'
const roleArr = [
    {id: 1, name: '管理员'},
    {id: 2, name: '其它'}
];

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
        return (<div className="tenantmanage-admin" style={{marginLeft:'55px'}}>
            <div id="bfd-tab-style2">
                <Tabs>
                    <TabList>
                        <Tab>功能权限</Tab>
                        <Tab>数据授权</Tab>
                        {/*<Tab>资源授权</Tab>*/}
                    </TabList>
                    <TabPanel><FunctionAuthority roleId={this.props.roleId} isSee={true}/></TabPanel>
                    <TabPanel><SeeDataAuthority tenantId={this.props.tenantId}/></TabPanel>
                  {/*<TabPanel><ResourceAuthority/></TabPanel>*/}
                </Tabs>

            </div>
            </div>
        );
    }
}

export default SeeAuthority;