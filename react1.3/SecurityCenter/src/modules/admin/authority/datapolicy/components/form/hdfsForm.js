import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { MultipleSelect } from 'bfd-ui/lib/MultipleSelect'
import message from 'CommonComponent/component/bdosmessage'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import AdminEnum from 'AdminEnum'
import AjaxReq from '../../../model/AjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import AdminBaseHdfs from 'AdminBaseHdfs'
let breadArrAdd = [{
  text: '权限管理',
  url: ''//如果不需要跳转url可以为空或不写url
}, {
  text: "数据策略",
  url: ''
}, {
  text: "策略编辑HDFS",
  url: ''
}];
let breadArrEdit = [{
  text: '权限管理',
  url: ''//如果不需要跳转url可以为空或不写url
}, {
  text: "数据策略",
  url: ''
}, {
  text: "策略编辑HDFS",
  url: ''
}];

let that;
class HdfsForm extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
  }

  handleCancel(e) {
    /*if (e) {
      e.preventDefault();
    }*/
    //操作，返回列表
    this.props.cancel(2);
  }

  componentDidMount() {
  }


  /**
   * 处理提交
   * @param e
     */
  handleSubmit(e) {
    that.refs.hdfsContent.submit((data)=>{
      that.handleCancel();
    })
    if (e) e.preventDefault();
  }

  render() {
    that = this;
    let saveBtn;
    let curBreadArr = this.props.viewType == AdminEnum.ADD_UI?breadArrAdd:breadArrEdit;
    if (!this.props.noHaveSaveBtn && this.props.viewType != AdminEnum.SEE_UI) {
      saveBtn = <button type="button" className="btn btn-sm btn-primary common-margin-right"
                        onClick={this.handleSubmit.bind(this)}>保存</button>;
    }
    return (<div>
        <EditPanel history={this.props.history} breadCrumbList={curBreadArr} onChange={this.handleCancel.bind(this)}>
          <FormCategory>
            <FormCategoryItem name="策略">
              <AdminBaseHdfs ref="hdfsContent" viewType={this.props.viewType} data={this.props.data} cancelClick={this.handleCancel.bind(this)} resources={["path"]}/>
            </FormCategoryItem>
          </FormCategory>
          <div style={{marginLeft:'272px'}}>
            {saveBtn}
            <button type="button" className="btn btn-sm btn-default" onClick={this.handleCancel.bind(this)}>取消</button>
          </div>
        </EditPanel>
      </div>
    );
  }
}

export default HdfsForm;
