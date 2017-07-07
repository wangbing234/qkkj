import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { MultipleSelect } from 'bfd-ui/lib/MultipleSelect'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import message from 'CommonComponent/component/bdosmessage'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import AdminEnum from 'AdminEnum'
import AjaxReq from '../../../model/AjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import commonAjaxReq from 'commonAjaxReq'
import AdminBaseHive from 'AdminBaseHive'

let breadArr = [{
  text: '权限管理',
  url: ''//如果不需要跳转url可以为空或不写url
}, {
  text: "数据策略",
  url: ''
}, {
  text: "Hive策略编辑",
  url: ''
}];

let that;
class HiveForm extends React.Component {
  constructor(prop) {
    super(prop);
    that = this;
  }

  handleCancel(e) {
    /*if (e) {
      e.preventDefault();
    }*/
    //操作，返回列表
    this.props.cancel(0);
  }

  componentDidMount() {
  }

  toLowerArray(database){
    let _array=[];
    for (let obj of database) {
      _array.push(obj.toLowerCase())
    }
    return _array;
  }

  handleSubmit(e) {
    if (this.refs.hiveForm.validate()) {
      console.log('表单验证通过');
      let obj = $.extend(true, {}, this.refs.hiveForm.state);
      obj.database=this.toLowerArray(obj.database);
      let param = AdminAuthorityStateTranfer.stateToJson(obj, this.props.resources);
      console.log(JSON.stringify(param));
      //调用后台保存方法。。。
      AjaxReq.savePolicy(param, (data)=> {
        message.success('策略编辑成功');
        this.handleCancel();
      });
    } else {
      console.log('表单验证失败');
    }
    if (e) e.preventDefault();
  }

  render() {
    that = this;
    let saveBtn;
    if (!this.props.noHaveSaveBtn && this.props.viewType != AdminEnum.SEE_UI) {
      saveBtn = <button type="button" className="btn btn-sm btn-primary common-margin-right"
                        onClick={this.handleSubmit.bind(this)}>保存</button>;
    }
    return (<div>
        <EditPanel history={this.props.history} breadCrumbList={breadArr} onChange={this.handleCancel.bind(this)}>
          <FormCategory>
            <FormCategoryItem name="策略">
              <AdminBaseHive ref="hiveForm" viewType={this.props.viewType} data={this.props.data}/>
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

export default HiveForm;
