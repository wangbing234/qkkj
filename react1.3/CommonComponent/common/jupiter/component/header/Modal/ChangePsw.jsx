/***************************************************
 * 时间: 7/25/16 17:30
 * 作者: zhongxia
 * 说明:
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
//bfd-ui components
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'CommonComponent/component/bdosmessage'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import { FormSelect, Option } from 'bfd-ui/lib/FormSelect'

//custom components
import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'
import BaseValidate from 'CommonComponent/utils/BaseValidate'

import Model from '../model'

class ChangePsw extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      formData: {
        userName: prop.userName
      },   //表单值存放对象
    };

    let that = this;
    this.rules = {
      //旧密码
      userPassword(value){
        value = value || '';
        if (that.state.realTimeValidate) {
          if (!Model.validatePassword(that.state.formData.userName, value)) {
            return "旧密码不正确"
          }
        }
        return BaseValidate.validateInput({label: "旧密码", value: value, isRequired: true});
      },

      //新密码
      reUserPassword(value){
        value = value || '';
        const userName = that.state.formData.userName;
        if (value === userName) return "与用户名重名";
        if (value.split('').reverse().join('') === userName) return "不能与用户名倒写一致";

        return BaseValidate.validateInput(
          {
            label: "新密码",
            value: value,
            isRequired: true,
            regExp: RestrictConst.PWD,
            regExpErrorStr: '必须包含大小写字母、数字、特殊字符中的两种'
          }
        );
      },

      //确定密码
      reUserPassword1(value){
        value = value || '';
        const userName = that.state.formData.userName;
        if (value === userName) return "与用户名重名";
        if (value.split('').reverse().join('') === userName) return "不能与用户名倒写一致";
        if (value !== that.state.formData.reUserPassword) return "两次输入密码不一致";

        return BaseValidate.validateInput({
          label: "确定密码",
          value: value,
          isRequired: true,
          regExp: RestrictConst.PWD,
          regExpErrorStr: '必须包含大小写字母、数字、特殊字符中的两种'
        });
      }
    }
  }


  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = this.state.formData || {};
    //针对 多选框, 文本框
    if (event && event.target) {
      newState[name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    this.setState({formData: newState, realTimeValidate: true});
  }

  /**
   * 验证旧密码
   */
  validatePsw(refName) {
    let formItem = this.refs[refName];
    formItem && formItem.validate(this.state.formData.userPassword);
  }

  /**
   * 关闭实时验证
   */
  closeRealTimeValidate() {
    console.log("input focus")
    this.setState({realTimeValidate: false})
  }

  /**
   * 关闭页面
   */
  close() {
    this.props.close && this.props.close();
  }

  /**
   * 添加或者更新
   */
  submit() {
    const that = this;
    const form = this.refs.form;
    if (form.validate()) {
      let data = {
        userName: this.state.formData.userName,
        userPassword: this.state.formData.reUserPassword
      };

      Model.changePassword(data, function (result) {
        console.log("change password success !", result)
        message.success("密码修改成功!")
        that.close(true)
      })
    }
  }


  render() {
    const style = {
      width: {
        width: 300,
      },
      center: {
        marginLeft: 100
      }
    }

    return (
      <div>
        <Form
          ref="form"
          className="bdos-form"
          data={this.state.formData}
          rules={this.rules}>

          <FormItem ref="refUserPassword" required label="旧密码" name="userPassword">
            <input type="password"
                   style={style.width}
                   className="form-control"
                   value={this.state.formData.userPassword}
                   onBlur={this.validatePsw.bind(this,'refUserPassword')}
                   onFocus={this.closeRealTimeValidate.bind(this)}
                   onChange={this.handleChange.bind(this,'userPassword')}/>
          </FormItem>

          <FormItem required label="新密码" name="reUserPassword" help="必须包含大小写字母、数字、特殊字符中的两种；长度为8-16个字符；不能与用户名或用户名倒写重名">
            <input type="password"
                   style={style.width}
                   className="form-control"
                   value={this.state.formData.reUserPassword}
                   onChange={this.handleChange.bind(this,'reUserPassword')}/>
          </FormItem>

          <FormItem required label="确定密码" name="reUserPassword1" help="必须包含大小写字母、数字、特殊字符中的两种；长度为8-16个字符；不能与用户名或用户名倒写重名">
            <input type="password"
                   style={style.width}
                   className="form-control"
                   value={this.state.formData.reUserPassword1}
                   onChange={this.handleChange.bind(this,'reUserPassword1')}/>
          </FormItem>

          <div style={style.center}>
            <button type="button"
                    style={{margin:'0 30px'}}
                    className="btn btn-sm btn-primary" onClick={this.submit.bind(this)}>提交
            </button>

            <button type="button"
                    className="btn btn-sm btn-default" onClick={this.close.bind(this)}>取消
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

export default ChangePsw