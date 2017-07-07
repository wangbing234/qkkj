import React, { PropTypes } from 'react'
import classNames from 'classnames'
import {Form,FormItem} from 'bfd-ui/lib/Form'

let that;
class FormDEMO extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
    this.rules = {
      name(v) {
        if (!v) return '请填写用户群'
      },
      password(v) {
        if (!v) return '日期不能为空'
      }
    }
  }

  /**
   * 表单值绑定到state上
   * @param name 字段名
   * @param event 事件对象
   */
  handleChange(name, event) {
    let newState = {};
    //针对 多选框, 文本框
    if (event && event.target) {
      newState[name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }
    //针对 Select 组件
    else {
      newState[name] = event;
    }
    this.refs.form.validate(this.state)
    this.setState(newState);
  }

  componentWillUnmount() {
    that = null;
  }

  handleSave() {
    console.log(this.state)
    if (this.refs.form.validate(this.state)) {

    }
  }

  render() {
    that = this;
    return (
      <div>
        <h1>Form</h1>
        <Form ref="form" className="bdos-form" rules={this.rules}>
          <FormItem required label="用户名" name="name" help="5个字符以内">
            <input type="text"
                   className="form-control"
                   style={{width:200}}
                   value={this.state.name}
                   onChange={this.handleChange.bind(this,'name')}/>
          </FormItem>
          <FormItem label="密码" name="password" help="请输入大写英文字符,小写英文字符,数字,特殊字符, 最小长度 6 个字符, 最大长度 20 个字符">
            <input type="text" className="form-control" style={{width:200}}
                   value={this.state.password}
                   onChange={this.handleChange.bind(this,'password')}/>
          </FormItem>
        </Form>
        <button type="button" style={{marginLeft: '100px'}}
                className="btn btn-primary"
                onClick={this.handleSave.bind(this)}>保存
        </button>
      </div>
    );
  }
}

export default FormDEMO