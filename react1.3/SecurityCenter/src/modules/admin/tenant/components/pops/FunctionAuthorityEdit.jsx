import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import SelectTree from 'bfd-ui/lib/Tree/SelectTree'
import FunctionAuthority from '../common/FunctionAuthority.jsx'
import FormFooter from 'CommonComponent/component/formfooter'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import EditPanel from 'CommonComponent/component/bdoseditpanel'

let breadArr = [{
  text: '租户管理',
  url: ''//如果不需要跳转url可以为空或不写url
}, {
  text: '功能授权',
  url: ''
}];
class FunctionAuthorityEdit extends React.Component {

  constructor(prop) {
    super(prop);
    this.state = {};

  }


  //submit按钮提交操作
  handleSubmit(e) {
    this.refs.functionAuthority.handleSubmit();
  }

  render() {
    return (<div>
      <EditPanel history={this.props.history} breadCrumbList={breadArr} onChange={this.props.cancel}>
        <div>
          <FormCategory>
            <FormCategoryItem name="功能授权">
              <FunctionAuthority ref="functionAuthority"
                                 roleId={this.props.roleId}
                                 cancel={this.props.cancel}
                                 style={{marginLeft:'80px',border:'1px #dee3e8 solid',backgroundColor:'#F9F9F9',padding:'15px 15px'}}/>
            </FormCategoryItem>
            </FormCategory>
          <FormFooter style={{marginLeft:'250px'}} submitClick={this.handleSubmit.bind(this)}
                      cancelClick={this.props.cancel}/>
        </div>
      </EditPanel>

    </div>);
  }
}

export default FunctionAuthorityEdit;