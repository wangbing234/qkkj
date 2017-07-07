import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import SelectTree from 'bfd-ui/lib/Tree/SelectTree'
import FormFooter from 'CommonComponent/component/formfooter'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import ResourceAuthority from '../common/ResourceAuthority.jsx'


class ResourceAuthorityEdit  extends React.Component{

    constructor(prop) {
        super(prop);
        this.state = {
            data: [{
                name: '数据工厂',
                open: true,
                children: [{
                    name: 'adsdsd',
                    checked: true
                }]
            }, {
                name: '配置中心',
                children: [{
                    name: 'dsads'
                }]
            }, {
                name: '配置中心2'
            }]
        };

    }


    //submit按钮提交操作
    handleSubmit(e) {
        if(e){e.preventDefault()}
        if(this.refs.form.validate(this.state)){
            console.log('表单验证通过');
            //验证通过
        } else {
            console.log('表单验证失败');
        }
    }

    render() {

        return (<div className="module-border">
            <div style={{marginLeft:'20px'}}>
                <h3>资源权限</h3>
                <hr/>
                <ResourceAuthority style={{marginTop:'20px',marginBottom:'20px'}}/>
                <FormFooter style={{marginLeft:'40px'}} submitClick={this.handleSubmit.bind(this)} cancelClick={this.props.cancel}/>
            </div>
        </div>);
    }
}

export default ResourceAuthorityEdit;