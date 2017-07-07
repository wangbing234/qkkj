import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import FormFooter from 'CommonComponent/component/formfooter'
import RegularConst from "CommonComponent/utils/RegularConst"
import AdminEnum from 'AdminEnum'
import AjaxReq from '../model/AjaxReq'
import {FormCategory,FormCategoryItem} from 'CommonComponent/component/formcategory/index'
import EditPanel from 'CommonComponent/component/bdoseditpanel'
import AuthButton from 'CommonComponent/component/authbutton'


let breadArr = [{
  text: '用户管理',
  url: ''//如果不需要跳转url可以为空或不写url
}, {
  text: '创建用户',
  url: ''
}];

//超级管理员
const superAdminRole = [
  {id: 1, name: '管理员'},
  {id: 2, name: '租户成员'},
  {id: 3, name: '系统用户'}
];

//管理员
const adminRole = [
  {id: 2, name: '租户成员'}
];

let isAdd;
let that;

class UserInfoForm extends React.Component {

  constructor(prop) {
    super(prop);
    that = this;
    isAdd = this.props.data.viewType == 'add' ? true : false;
    this.showUserState = true;
    this.isSuperAdmin = window._currentUser.userType == window.BFD.ENUM.UserType.SUPERADMIN;
    this.canSeePwd = false;
    this.pwdIcon = 'eye-slash';
    this.state = {
      userName: '',
      userPassword: 'jupiter123',
      //reUserPassword: '',
      phoneNumber: '',
      email: '',
      roleName: '',
      status: '0',
      userType: this.isSuperAdmin ? 1 : 2,
      tenantId: '',//租户id
      ...this.props.data
    };
    this.rules = {
      userName: value => {
        let msg = BaseValidate.validateInput({
          isRequired: true,
          label: "用户名",
          value: value,
          minLength:4,
          maxLength: 16,
          regExp: RestrictConst.NUM_STRING_UNDERLINE_AT_POINT
        });
        if (this.isExistUserName) {
          msg = '用户名已存在，请重新输入';
        }
        return msg;
      },
      userPassword: value => {
        let errStr = BaseValidate.validateInput({
          isRequired: true,
          label: "密码",
          minLength: 8,
          maxLength: 16,
          value: value
        });

        return errStr;
      },
      /*reUserPassword: value => {
       let msg = BaseValidate.validateInput({isRequired: true, label: "确认密码", value: value});
       if (!that.pwdIsEqual(value)) {
       msg = "两次输入密码不一致";
       }
       return msg;
       },*/
      phoneNumber: value => {
        return BaseValidate.validateInput({
          isRequired: false,
          label: "手机",
          value: value,
          regExp: RegularConst.PHONE_STRING.name
        });
      },
      email: value => {
        return BaseValidate.validateInput({
          isRequired: false,
          label: "邮箱",
          value: value,
          regExp: RegularConst.EMAIL_STRING.name
        });
      },
      userType: value => {
        return BaseValidate.validateInput({isRequired: true, label: "用户类型", value: value});
      },
      tenantId: value => {
        return BaseValidate.validateInput({isRequired: true, label: "租户", value: value});
      }

    };
  }

  handleChange(dateField, evt) {
    let value = evt && evt.target ? evt.target.value : evt;
    let isSetUserState;
    if (dateField == 'userName') {
      this.isExistUserName = false;
    } else if (dateField == 'tenantId') {
      this.refs.tenantId.validate(value);
    }else if (dateField == 'userType'){
      if(value == 3){//系统用户
        isSetUserState = {status:'1'};//如果选择系统用户，用户状态默认为1：禁用
      }else if (value == 2){//租户成员
        //查询租户列表
        this.getTenantList();
      }
    }
    this.setState({[dateField]: value,...isSetUserState});
  }

  //查询租户list
  getTenantList() {
    let that = this;
    this.tenantListAjax = AjaxReq.getTenantList((result) => {
      if (result && result.length > 0) {
        result.unshift({id: '', tenantName: '全部租户'});
        if (that) {
          that.setState({tenantArr: result})
        }
      }
    })
  }

  /**用户名失去焦点**/
  focusOutHandler(evt) {
    let userName = evt.target.value;
    let userObj = {userName: userName};
    AjaxReq.userIsExist(`data=${JSON.stringify(userObj)}`, (result)=> {
      if (result) {
        this.isExistUserName = true;
      } else {
        this.isExistUserName = false;
      }
      this.refs.userName.validate(userName);
    });

  }

  //submit按钮提交操作
  handleSubmit(e) {
    if (e) {
      e.preventDefault()
    }

    if (this.refs.form.validate(this.state)) {
      console.log('表单验证通过');
      if (isAdd) {
        let data = {
          tenantId: this.state.tenantId,
          user: {
            userName: this.state.userName,
            userPassword: this.state.userPassword,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            userType: this.state.userType,
            status: this.state.status
          }
        };
        //验证通过
        this.props.saveClick(`data=${JSON.stringify(data)}`);
      } else {
        let data = {
          userName: this.state.userName, phoneNumber: this.state.phoneNumber, email: this.state.email,
          userType: this.state.userType, status: this.state.status
        };
        //验证通过
        this.props.editClick(data);
      }

    } else {
      console.log('表单验证失败');
    }
  }

  renderTenant() {
    let curArr = this.state.tenantArr?this.state.tenantArr:this.props.tenantArr;
    return <FormItem label="租户" ref="tenantId" name="tenantId" required>
      <Select value={Number(this.state.tenantId)} className="common-select"
              onChange={this.handleChange.bind(this,'tenantId')}
              disabled={!isAdd} searchable>
        {
          curArr.map(function (item, index) {
            return (<Option key={index}
                            value={item.id}>{item.tenantName}</Option>);
          })
        }
      </Select>
    </FormItem>;
  }

  renderPwd(){
    return  <FormItem label="密码" name="userPassword" required>
      <div style={{display:'inline'}}>
        <RestrictInput type={this.canSeePwd?'text':'password'} value={this.state.userPassword} name="userPassword"
                       className="form-control common-form-input"
                       onChange={this.handleChange.bind(this,"userPassword")}
                       tipString="必须包含大小写字母、数字、特殊字符中的两种；长度为8-16个字符；不能与用户名或用户名倒写重名"/>
        <AuthButton renderType="icon" type={this.pwdIcon} title="查看" onClick={this.seePwd.bind(this)}
                    style={{lineHeight:'30px',marginLeft:'5px'}}/>
      </div>
    </FormItem>;
    /*rePasswordComp = <FormItem label="确认密码" ref="reUserPassword" name="reUserPassword" required>
     <RestrictInput type="password" value={this.state.reUserPassword} className="form-control common-form-input"
     onChange={this.handleChange.bind(this,"reUserPassword")}
     onBlur={this.rePwdonBlurHandelr.bind(this)}/>
     </FormItem>;*/
  }

  renderUserState(){
    let viewType = this.props.data.viewType;
    return <FormItem label="状态" name="status">
      <RadioGroup value={String(this.state.status)} onChange={this.handleChange.bind(this,'status')}
                  disabled={viewType=='see'}>
        <Radio value='0'>启用</Radio>
        <Radio value='1'>禁用</Radio>
      </RadioGroup>
    </FormItem>;
  }

  /**点击显示或隐藏密码**/
  seePwd() {
    this.canSeePwd = !this.canSeePwd;
    if (this.pwdIcon == 'eye-slash') {
      this.pwdIcon = 'eye';
    } else {
      this.pwdIcon = 'eye-slash';
    }
    this.setState({});
  }

  render() {
    that = this;
    let viewType = this.props.data.viewType;
    let curRoleArr = adminRole;
    //超级管理员才能选择用户类型
    if (this.isSuperAdmin) {
      curRoleArr = superAdminRole;
    }

    let passwordComp;
    //新增时才有密码框，系统用户没有密码
    if (isAdd && this.state.userType!= 3 ) {
      passwordComp = this.renderPwd();
    }

    //用户类型=3：系统用户时隐藏用户状态
    let userStateUI;
    if(this.state.userType != 3){
      userStateUI = this.renderUserState();
    }

    //用户类型等于2：租户成员时才能选择租户
    let tenantSelect;
    if (this.state.userType == 2) {
      tenantSelect = this.renderTenant();
    }

    //用户查看时没有保存按钮
    let saveBtn;
    if (viewType != 'see') {
      saveBtn = <button type="button" className="btn btn-sm btn-primary common-margin-right"
                        onClick={this.handleSubmit.bind(this)}>保存</button>;
    }
    return (<div>
        <EditPanel history={this.props.history} breadCrumbList={breadArr} onChange={this.props.cancelClick}>
          <div>
            <FormCategory>
              <FormCategoryItem name="用户基本信息">
                <Form ref="form" rules={this.rules}>
                  <FormItem label="用户名" required ref="userName" name="userName">
                    <RestrictInput type="text" value={this.state.userName} className="form-control common-form-input"
                                   onChange={this.handleChange.bind(this,"userName")}
                                   restrict={RestrictConst.NUM_STRING_UNDERLINE_AT_POINT}
                                   maxLength="16"
                                   tipString="只能输入字母、数字、下划线、点和@，且必须以字母开头，长度为4-16个字符"
                                   disabled={viewType!='add'} onBlur={this.focusOutHandler.bind(this)}
                    />
                  </FormItem>

                  <FormItem label="用户类型" name="userType" required>
                    <Select value={this.state.userType} className="common-select"
                            onChange={this.handleChange.bind(this,'userType')}
                            disabled={viewType!='add'}>
                      {
                        curRoleArr.map(function (item, index) {
                          return (<Option key={index}
                                          value={item.id}>{item.name}</Option>);
                        })
                      }
                    </Select>
                  </FormItem>
                  {tenantSelect}
                  {passwordComp}
                  <FormItem label="手机" name="phoneNumber">
                    <RestrictInput type="text" value={this.state.phoneNumber} className="form-control common-form-input"
                                   onChange={this.handleChange.bind(this,"phoneNumber")}
                                   restrict={RestrictConst.NUM}
                                   tipString="格式：13500000000"
                                   disabled={viewType=='see'}/>
                  </FormItem>

                  <FormItem label="邮箱" name="email">
                    <RestrictInput type="text" value={this.state.email} className="form-control common-form-input"
                                   onChange={this.handleChange.bind(this,"email")}
                                   restrict={RestrictConst.EMAIL_STRING}
                                   disabled={viewType=='see'}/>
                  </FormItem>
                  {userStateUI}
                </Form>
              </FormCategoryItem>

            </FormCategory>
            <div style={{marginLeft:'270px'}}>
              {saveBtn}
              <button type="button" className="btn btn-sm btn-default" onClick={this.props.cancelClick}>取消</button>
            </div>
          </div>
        </EditPanel>


      </div>
    );
  }
}

module.exports = UserInfoForm;