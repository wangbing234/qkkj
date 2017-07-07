/***************************************************
 * 时间: 16/6/24 10:51
 * 作者: zhongxia
 * 说明: 添加用户
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import message from 'bfd-ui/lib/message'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'

import RestrictInput from 'CommonComponent/component/restrictinput'
import RestrictTextarea from 'CommonComponent/component/restricttextarea'
import RestrictConst from 'CommonComponent/utils/RestrictConst'

import Model from 'model/userManager'

let that;
class AddUser extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      userType: 2,  //用户类型, 默认写死2
      status: 0,
      ...prop.data
    };

    this.rules = {
      userName(val){
        if (!val) return '用户名不能为空!'
      }
    }
  }

  componentWillUnmount() {
    that = null;
  }

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState(newState);
  }

  closePage() {
    that.props.parent && that.props.parent.setState({isAddUserPage: false})
  }

  addOrEditUser() {
    if (that.refs.form.validate(that.state)) {
      if (that.state.id) {
        Model.updateUser(that.state, function (result) {
          console.log("result", result)
          message.success("更新用户成功!")
          that.props.parent.getUser();
          that.closePage()
        })
      } else {
        Model.addUser(that.state, function (result) {
          console.log("result", result)
          message.success("添加用户成功!")
          that.props.parent.getUser();
          that.closePage()
        })
      }

    }
  }


  render() {
    that = this;
    const style = {
      width: {
        width: 350,
        display: 'inline-block'
      },
      center: {
        marginLeft: 100
      }
    }

    return (
      <div className="bdos-edit-form">
        <Form
          ref="form"
          data={this.state}
          rules={this.rules}>
          <FormItem label="用户名" required name="userName">
            <RestrictInput type="text"
                           style={style.width}
                           className="form-control"
                           value={this.state.userName}
                           restrict={RestrictConst.NUM_STRING_CHARS_UNDERLINE_24}
                           tipString="支持中文、字母、数字、下划线，长度不大于24个字符"
                           onChange={that.handleChange.bind(that,'userName')}/>
          </FormItem>

          <FormItem label="手机" name="phone">
            <RestrictInput type="text"
                           style={style.width}
                           className="form-control"
                           value={this.state.phoneNumber}
                           onChange={that.handleChange.bind(that,'phoneNumber')}/>
          </FormItem>

          <FormItem label="邮箱" name="email">
            <RestrictInput type="text"
                           style={style.width}
                           className="form-control"
                           value={this.state.email}
                           onChange={that.handleChange.bind(that,'email')}/>
          </FormItem>

          <FormItem label="状态" name="param">
            <RadioGroup value={this.state.status} onChange={this.handleChange.bind(this,'status')}>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>禁用</Radio>
            </RadioGroup>
          </FormItem>

          <div style={style.center}>
            <button type="button"
                    className="btn btn-sm btn-primary" onClick={this.addOrEditUser}>确定
            </button>
            <button type="button"
                    style={{marginLeft:30}}
                    className="btn btn-sm btn-default" onClick={this.closePage}>取消
            </button>
          </div>
        </Form>
      </div>
    );
  }
}

export default AddUser