/***************************************************
 * 时间: 7/25/16 17:30
 * 作者: zhongxia
 * 说明: 用户信息, 从召新的接口  getUserAllInfo获取的信息,直接回显.
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

class UserInfo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      userName: prop.userName,
      formData: {}
    };

    this.rules = {
      phoneNumber(value){
        return BaseValidate.validateInput({
          label: "手机",
          value: value,
          isRequired: true,
          regExp: RestrictConst.PHONE,
          regExpErrorStr: '请输入正确的电话格式'
        });
      },
      email(value){
        return BaseValidate.validateInput({
          label: "邮箱", value: value, isRequired: true,
          regExp: RestrictConst.EMAIL,
          regExpErrorStr: '请输入正确的邮箱格式'
        });
      }
    }
  }

  componentDidMount() {
    Model.getUserInfo(this.state.userName, result=> {
      this.setState({formData: result.data})
    })
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
    this.setState({formData: newState});
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
      let data = this.state.formData;

      Model.updateUserInfo(data, function (result) {
        console.log("result", result)
        message.success("修改用户信息成功!")
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

          <FormItem required label="用户名" name="userName" help="输入用户名">
            <input type="text"
                   style={style.width}
                   className="form-control"
                   disabled={true}
                   value={this.state.formData.userName}
                   onChange={this.handleChange.bind(this,'userName')}/>
          </FormItem>

          <FormItem required label="所在租户" name="tenantName">
            <input type="text"
                   style={style.width}
                   className="form-control"
                   disabled={true}
                   value={this.state.formData.tenantName}
                   onChange={this.handleChange.bind(this,'tenantName')}/>
          </FormItem>

          <FormItem required label="手机" name="phoneNumber">
            <input type="text"
                   style={style.width}
                   className="form-control"
                   value={this.state.formData.phoneNumber}
                   onChange={this.handleChange.bind(this,'phoneNumber')}/>
          </FormItem>

          <FormItem required label="邮箱" name="email">
            <input type="text"
                   style={style.width}
                   className="form-control"
                   value={this.state.formData.email}
                   onChange={this.handleChange.bind(this,'email')}/>
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

export default UserInfo