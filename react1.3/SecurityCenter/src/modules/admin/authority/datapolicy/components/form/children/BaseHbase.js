import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { MultipleSelect } from 'bfd-ui/lib/MultipleSelect'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import message from 'CommonComponent/component/bdosmessage'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import AdminEnum from 'AdminEnum'
import AjaxReq from '../../../../model/AjaxReq'
import commonAjaxReq from 'commonAjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'

let that;
let resourceArr = [];
let hbaseSqlArr = [];
let viewType;
class BaseHbase extends React.Component {
  constructor(prop) {
    super(prop);
    viewType = this.props.viewType;
    that = this;
    this.state = {
      resourceType: 'hbase',
      policyName: '',
      resourceId: '',
      database: [],
      roleName: '',
      tenantName: '',
      description: '',
      ...this.props.data
    };

    this.rules = {
      /*policyName: value => {
       return BaseValidate.validateInput({isRequired: true, label: "策略名称", value: value, minLength: 4});
       },
       hiveSource: value => {
       return BaseValidate.validateInput({isRequired: true, label: "hive源", value: value});
       },*/
      database: value => {
        return BaseValidate.validateInput({isRequired: true, label: "命名空间", value: value});
      },
      /*authorityObj: value => {
       return BaseValidate.validateInput({isRequired: true, label: "授权对象", value: value});
       },*/
      comment: value => {
        return BaseValidate.validateInput({label: "描述", maxLength: 255, value: value});
      }
    };
  }

  handleChange(dataField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    this.setState({[dataField]: value});
    if(dataField == 'resourceId'){
      this.getHbaseDb(value);
    }
  }


  componentDidMount() {
    this.getResource();
  }

  /**获取hbase源**/
  getResource() {
    commonAjaxReq.getCommonResources({type: "hbase"}, (data)=> {
      resourceArr = data;
      this.setState({});
    });
  }

  //根据hive资源获取hive数据库
  getHbaseDb(id){
    commonAjaxReq.getHiveDb({resourceId: id}, (data)=> {
      hbaseSqlArr = data;
      this.setState({});
    });
  }


  validate(){
    return this.refs.form.validate(this.state);
  }

  render() {
    that = this;
    return (<div>
              <Form ref="form" rules={this.rules}>
                <FormItem label="策略名称" name="policyName">
                  <RestrictInput type="text" value={this.state.policyName} className="form-control common-form-input"
                                 onChange={this.handleChange.bind(this,"policyName")}
                                 //restrict={RestrictConst.NUM_START_STRING_UNDERLINE_64}
                                 //tipString="只能输入字母、数字、下划线且必须以字母开头，长度小于64个字符"
                                 maxLength="64"
                                 disabled={true}
                  />
                </FormItem>
                <FormItem label="Hbase源" name="resourceId">
                  <Select value={this.state.resourceId} onChange={this.handleChange.bind(this,"resourceId")}
                          className="common-select" disabled={true}>
                    {
                      resourceArr.map(function (item, index) {
                        return (<Option key={index}
                                        value={item.id}>{item.name}</Option>);
                      })
                    }
                  </Select>
                </FormItem>
                <FormItem label="命名空间:" name="database" required>
                  <MultipleSelect className="common-select" values={this.state.database} tagable
                                  onChange={this.handleChange.bind(this,'database')}
                                  disabled={viewType == AdminEnum.SEE_UI}>
                    {
                      hbaseSqlArr.map(function (item, index) {
                        return (<Option key={index}
                                        value={item}>{item}</Option>);
                      })
                    }
                  </MultipleSelect>
                </FormItem>
                <FormItem label="授权对象" name="tenantName">
                  <RestrictInput type="text" value={this.state.tenantName} className="form-control common-form-input"
                                 onChange={this.handleChange.bind(this,"tenantName")}
                                 disabled={true}
                  />
                </FormItem>
                <FormItem label="描述" name="description">
                  <RestrictTextarea className="form-control common-textarea"
                                    value={this.state.description}
                                    onChange={this.handleChange.bind(this,"description")}
                                    disabled={viewType == AdminEnum.SEE_UI}/>
                </FormItem>
              </Form>
      </div>
    );
  }
}

export default BaseHbase;
