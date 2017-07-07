/***************************************************
 * 时间: 2016/7/21 15:51
 * 作者: bing.wang
 * 说明: 租户基本信息
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import '../css/index.less'
import Ajax from '../ajax/AjaxReq'

let breadArr = [{
  text: '基础信息',
  url: ''//如果不需要跳转url可以为空或不写url
}];

const Index = React.createClass({
  getInitialState() {
    return {
      enabled: true,
      isEdit: false,
      telentLevel: 2,
      clusterArr: [{"telentLevel": 1, "id": 1}, {"telentLevel": 2, "id": 2}, {"telentLevel": 3, "id": 3}]
    };
  },

  componentDidMount() {
    this.getDataByUrl();
  },

  /**
   * 获取hive列表
   * @param currentPage
   */
  getDataByUrl() {
    Ajax.getTenantInfo(null, (data) => {
      this.setState({...data.data})
    })
  },

  /**
   * 公用修改处理
   * @param dataField
   * @param evt
   */
  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
  },

  render() {
    var enabled = this.state.isEdit ? {} : {"readOnly": "readOnly"};
    return (
      <div>
          <EditPanel history={this.props.history} breadCrumbList={breadArr}>
          <FormCategory>
            <FormCategoryItem name="租户基础信息">
              <Form horizontal>
                <FormItem label="租户ID" name="tenantId">
                  <input {...enabled} className="form-control common-form-input" value={this.state.tenantId}/>
                </FormItem>
                <FormItem label="租户名称" name="tenantName">
                  <input {...enabled} className="form-control common-form-input" value={this.state.tenantName}/>
                </FormItem>
                <FormItem label="队列等级" name="queueName">
                  <input {...enabled} className="form-control common-form-input" value={this.state.queueName}/>
                </FormItem>
                <FormItem label="成员数" name="members">
                  <input {...enabled} className="form-control common-form-input" value={this.state.members}/>
                </FormItem>
                <FormItem label="租户所有者" name="userName">
                  <input {...enabled} className="form-control common-form-input" value={this.state.userName}/>
                </FormItem>
                <FormItem label="租户描述" name="comment">
                  <RestrictTextarea className="form-control common-textarea" {...enabled}
                                    value={this.state.comment}/>
                </FormItem>
              </Form>
            </FormCategoryItem>
          </FormCategory>
            </EditPanel>
      </div>
    );
  }
});

export default Index