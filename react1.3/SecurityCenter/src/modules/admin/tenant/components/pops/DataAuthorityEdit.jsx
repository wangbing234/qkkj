import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import FormFooter from 'CommonComponent/component/formfooter'
import DataAuthority from '../common/DataAuthority.jsx'
import EditPanel from 'CommonComponent/component/bdoseditpanel'

let breadArr = [{
  text: '租户管理',
  url:''//如果不需要跳转url可以为空或不写url
},{
  text: '数据授权',
  url:''
}];

class DataAuthorityEdit extends React.Component {

    constructor(prop) {
        super(prop);
        this.state = {

        };

    }

    //submit按钮提交操作
    handleSubmit(e) {
        if (e) {
            e.preventDefault()
        }

        this.refs.dataAuthority.handleSubmit();
    }

    render() {
        return (<div>
            <EditPanel history={this.props.history} breadCrumbList={breadArr} onChange={this.props.cancel}>
              <DataAuthority ref="dataAuthority" data={this.props.data} tenantId={this.props.tenantId} cancel={this.props.cancel}/>
              <FormFooter style={{marginLeft:'270px'}} submitClick={this.handleSubmit.bind(this)}
                          cancelClick={this.props.cancel}/>
            </EditPanel>

            </div>
        );
    }
}

export default DataAuthorityEdit;