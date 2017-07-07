import React from 'react';
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { MultipleSelect } from 'bfd-ui/lib/MultipleSelect'
import message from 'CommonComponent/component/bdosmessage'
import {RestrictInput,RestrictTextarea,BaseValidate,RestrictConst} from 'CommonComponent'
import CheckBoxAll from 'CommonComponent/component/checkboxall'
import AdminEnum from 'AdminEnum'
import AjaxReq from '../../../model/AjaxReq'
import AdminAuthorityStateTranfer from 'AdminAuthorityStateTranfer'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import CommonUtils from  '../../../../../common/component/CommonUtils'
import AjaxReqUserManage from '../../../../usermanage/model/AjaxReq'


let that;
//let authorityTypeArr = [{isAllowed: false, type: 'read'}, {isAllowed: false, type: 'write'}];//新增时怎么办 不用他的了
let authorityObjArr = [];//授权对象数据源
let filePathArr = [];
let viewType;
let roles = [];
let tenantIds = [];//授权对象
class HdfsFormContent extends React.Component {
  constructor(prop) {
    super(prop);
    viewType = this.props.viewType;
    that = this;
    this.isExistPolicyName = false;
    let data = this.props.data;
    if(data && data.accesses){
      data.accesses.map((item, index)=> {
        if (item.type == 'execute') {
          let delIndex = data.accesses.indexOf(item);
          data.accesses.splice(delIndex, 1);
        }
      });
    }

    this.state = {
      resourceType: 'hdfs',
      policyName: '',
      path: [],
      tenantName: '',
      description: '',
      tenantId: [],
      roles: [],//后台需要
      accesses: [{isAllowed: false, type: 'read'}, {isAllowed: false, type: 'write'}],
      ...data
    };

    this.policyName = this.props.data ? this.props.data.policyName : '';
    this.rules = {
      policyName: value => {
        let msg = BaseValidate.validateInput({isRequired: true, label: "策略名称", value: value, maxLength: 64});
        if (this.isExistPolicyName) {
          msg = '策略名称已存在，请重新输入';
        }
        return msg;
      },
      path: value => {
        let _errorString=BaseValidate.validateInput({isRequired: true, label: "文件目录", value: value});
        if(!_errorString) {
          _errorString = CommonUtils.vaildateHdfsPath(value);
        }
        return _errorString;
      },
      tenantId: value => {
        let msg = BaseValidate.validateInput({isRequired: true, label: "授权对象", value: value});
        let selectStr = $('#authorityObj ul').text();
        if(selectStr.length == 0){
          msg = '授权对象不能为空!'
        }
        return msg;
      },
      accesses: value => {//验证有些问题
        let msg ='权限类型不能为空';
        value.map((item,index)=>{
          if(item.isAllowed == true){
            msg = ''
          }
        });
        return msg;
      },
      comment: value => {
        return BaseValidate.validateInput({label: "描述", maxLength: 255, value: value});
      }
    };
  }

  handleChange(dataField, evt) {
    if (dataField == 'tenantId') {
      tenantIds = evt;
    } else if (dataField == 'policyName') {
      this.isExistPolicyName = false;
    }
    let value = evt && evt.target ? evt.target.value : evt;
    this.state[dataField]=value;
    this.setState({});
  }

  /**
   * 公用修改
   * @param dataField
   * @param evt
   */
  handleChangePath(dataField, evt) {
    this.handleChange(dataField, evt);
    this.refs.path.validate(this.state.path)
  }

  handleCancel(e) {
    if (e) {
      e.preventDefault();
    }
    //操作，返回列表
    this.props.cancel(2);
  }

  /**策略名称失去焦点**/
  focusOutHandler(evt) {
    let name = evt.target.value;
    if (name != this.policyName) {
      AjaxReq.isExistPolicyName({policyName: name}, (result)=> {
        this.isExistPolicyName = result.data;
        this.refs.policyName.validate(name);
      });
    }
  }

  componentDidMount() {
    this.getTenantList();
  }


  getTenantList() {
    if(viewType==AdminEnum.SEE_UI)
      return;
    AjaxReqUserManage.getTenantList((data)=> {
      if (data && data.length > 0) {
        authorityObjArr = data;
        that.setState({});
      }
    })
  }

  setRoles() {
    roles = [];
    tenantIds.map(function (tId, index) {
      authorityObjArr.map(function (item, index) {
        if (tId == item.id) {
          roles.push({roleid: item.roleId, rolename: ''})
        }
      });

    });
  }

  doVaildate() {
    return this.refs.form.validate(this.state);
  }

  setAccess(){
    this.state.accesses.map((item,index)=>{
      if(item.type=='read'){
        delete item.style;
      }
    });
    //this.state.accesses.push({isAllowed:true,type:'execute'})
  }

  submit(fun) {
    if (this.doVaildate()) {
      console.log('表单验证通过');
      //获取角色roles
      this.setRoles();
      this.setAccess();
      let obj = $.extend(true, {}, this.state);
      obj.accesses.push({isAllowed:true,type:'execute'});
      let param = AdminAuthorityStateTranfer.stateToJson(obj, this.props.resources, roles);
      //调用后台保存方法。。。
      AjaxReq.savePolicy(param, (data)=> {
        if (viewType == AdminEnum.ADD_UI) {
          message.success('新增策略成功')
        } else {
          message.success('策略编辑成功')
        }
        that.props.cancelClick();
      });
    } else {
      console.log('表单验证失败');
    }
  }

  render() {
    that = this;
    let saveBtn;
    let  tagable=(viewType==AdminEnum.SEE_UI?{tagable:true}:{});

    if (!this.props.noHaveSaveBtn) {
      saveBtn = <button type="button" className="btn btn-sm btn-primary common-margin-right"
                        onClick={this.submit.bind(this)}>保存</button>;
    }
    return (<Form ref="form" rules={this.rules}>
        <FormItem label="策略名称" ref="policyName" name="policyName" required>
          <RestrictInput type="text" value={this.state.policyName} className="form-control common-form-input"
                         onChange={this.handleChange.bind(this,"policyName")}
                         //restrict={RestrictConst.NUM_START_STRING_UNDERLINE_64}
                         //tipString="只能输入字母、数字、下划线且必须以字母开头，长度小于64个字符"
                         maxLength="64"
                         onBlur={this.focusOutHandler.bind(this)} disabled={viewType==AdminEnum.SEE_UI}/>
        </FormItem>
        <FormItem label="文件目录" name="path" required ref="path">
          <MultipleSelect values={this.state.path} tagable onChange={this.handleChangePath.bind(this,'path')}
                          className="common-select" disabled={viewType==AdminEnum.SEE_UI}>
            {
              filePathArr.map(function (item, index) {
                return (<Option key={index}
                                value={item.id}>{item.name}</Option>);
              })
            }

          </MultipleSelect>
        </FormItem>
        <FormItem label="授权对象" name="tenantId" required>
          <MultipleSelect id="authorityObj" values={this.state.tenantId}
                          onChange={this.handleChange.bind(this,'tenantId')}    disabled={viewType==AdminEnum.SEE_UI}   {...tagable}
                          className="common-select" >
            {
              authorityObjArr.map(function (item, index) {
                return (<Option key={index}
                                value={item.id}>{item.tenantName}</Option>);
              })
            }
          </MultipleSelect>
        </FormItem>
        <FormItem label="权限类型" name="accesses" required>

          <CheckBoxAll style={{display:'inline_block'}} ref="accessesBox" key="type" value="type"
                       list={this.state.accesses} checkedField="isAllowed" type="hdfs"
                       disabled={viewType==AdminEnum.SEE_UI}/>
        </FormItem>
        <FormItem label="描述" name="description">
          <RestrictTextarea className="form-control common-textarea"
                            value={this.state.description}
                            onChange={this.handleChange.bind(this,"description")}
                            disabled={viewType == AdminEnum.SEE_UI}/>
        </FormItem>
      </Form>
    );
  }
}

export default HdfsFormContent;
