import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { Select ,Option} from 'bfd-ui/lib/Select2'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import BaseValidate from  "CommonComponent/utils/BaseValidate"
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import RegularConst from "CommonComponent/utils/RegularConst"
import AjaxReq from '../../../usermanage/model/AjaxReq'
import AuthButton from 'CommonComponent/component/authbutton'

const roleArr = [
  {id: 1, name: '管理员'},
  {id: 2, name: '其它'}
];

class TenantOwner extends React.Component {

  constructor(prop) {
    super(prop);
    this.canSeePwd = false;
    this.pwdIcon = 'eye-slash';
    this.state = {
      userName: '',
      userPassword: 'jupiter123',
      /*reUserPassword: '',//放外面*/
      phoneNumber: '',
      email: '',
      userType: 2,
      ...this.props.data
    };

    this.rules = {
      userName: value => {
        let msg = BaseValidate.validateInput({isRequired: true, label: "用户名", value: value, minLength: 4,maxLength:16});
        if(this.isExistUserName){
          msg = '用户名已存在，请重新输入';
        }
        return msg;
      },
      userPassword: value => {
        return BaseValidate.validateInput({
          isRequired: true,
          label: "密码",
          value: value,
          minLength: 8,
          maxLength: 16,
          regExp: RestrictConst.PWD
        });
      },
      /*
      reUserPassword: value => {
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
      }

    };
  }

  handleChange(dataField, evt) {
    if(dataField == 'userName'){
      this.isExistUserName = false;
    }
    this.setState({[dataField]: evt.target.value});
  }

  validate() {
    return this.refs.form.validate(this.state);
  }

  getFormData() {
    return this.state;
  }

  pwdIsEqual(reUserPassword) {
    if (this.state.userPassword != reUserPassword) {
      return false;
    } else {
      return true;
    }
  }

  rePwdonBlurHandelr(evt) {
    this.refs.reUserPassword.validate(evt.target.value);
  }

  /**用户名失去焦点**/
  focusOutHandler(evt){
    let userName = evt.target.value;
    let userObj = {userName:userName};
    AjaxReq.userIsExist(`data=${JSON.stringify(userObj)}`,(result)=>{
      if(result){
        this.isExistUserName = true;
      } else{
        this.isExistUserName = false;
      }
      this.refs.userName.validate(userName);
    });
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

  renderPwd() {
    return (<div>
      <FormItem label="密码" ref="userPassword" name="userPassword" required>
        <div style={{display:'inline'}}>
        <RestrictInput type={this.canSeePwd?'text':'password'} value={this.state.userPassword} className="form-control common-form-input"
                       onChange={this.handleChange.bind(this,"userPassword")}
                       tipString="必须包含大小写字母、数字、特殊字符中的两种；长度为8-16个字符；不能与用户名或用户名倒写重名"
                       disabled={this.props.disabled}/>
        <AuthButton renderType="icon" type={this.pwdIcon} title="查看" onClick={this.seePwd.bind(this)}
                    style={{lineHeight:'30px',marginLeft:'5px'}}/>
        </div>
      </FormItem>

      {/*<FormItem label="确认密码" ref="reUserPassword" name="reUserPassword" required>
        <RestrictInput type="password" value={this.state.reUserPassword} className="form-control common-form-input"
                       onChange={this.handleChange.bind(this,"reUserPassword")}
                       disabled={this.props.disabled} onBlur={this.rePwdonBlurHandelr.bind(this)}/>
      </FormItem>*/}
    </div>)
  }

  render() {
    let passwordComp;
    if (this.props.isShowPwd) {
      passwordComp = this.renderPwd();
    }
    return (<div>
        <Form ref="form" rules={this.rules}>
          <FormItem label="用户名" required ref="userName" name="userName">
            <RestrictInput type="text" value={this.state.userName} className="form-control common-form-input"
                           onChange={this.handleChange.bind(this,"userName")}
                           restrict={RestrictConst.NUM_STRING_UNDERLINE_AT_POINT}
                           tipString="只能输入字母、数字、下划线、点和@，且必须以字母开头，长度为4-16个字符"
                           disabled={this.props.disabled} onBlur={this.focusOutHandler.bind(this)}/>
          </FormItem>

          {passwordComp}

          <FormItem label="手机" name="phoneNumber">
            <RestrictInput type="text" value={this.state.phoneNumber} className="form-control common-form-input"
                           onChange={this.handleChange.bind(this,"phoneNumber")}
                           restrict={RestrictConst.NUM}
                           tipString="格式：13500000000"
                           disabled={this.props.disabled}/>
          </FormItem>

          <FormItem label="邮箱" name="email">
            <RestrictInput type="text" value={this.state.email} className="form-control common-form-input"
                           onChange={this.handleChange.bind(this,"email")}
                           restrict={RestrictConst.EMAIL_STRING}
                           disabled={this.props.disabled}/>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default TenantOwner;