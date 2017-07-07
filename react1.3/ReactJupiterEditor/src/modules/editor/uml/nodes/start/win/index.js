import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form'

const StartWin = React.createClass({
  //初始化表单数据。
  getInitialState() {
    return {
      ...this.props.data
    }
  },

  /**
   * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
   * @returns {*}
   */
  getData() {
    return this.state;
  },

  //submit按钮提交操作
  handleSubmit(e) {
    this.setState({isSubmit: true});
    let o = this.state;
    delete o.isSubmit;
    e.preventDefault();
  },
  isArray(arr) {
    return (toString.apply(arr) === '[object Array]');
  },
  /*
   *设置表单字段值。
   */
  handleChange(name, event) {
    var newState = {};
    if (this.isArray(event)) {
      newState[name] = event;
    } else {
      newState[name] = name == "checked" ? event.target.checked : event.target.value;
    }
    this.setState(newState);
  },
  render() {
    return (
      <Form horizontal isSuccess={this.isSuccess}>
        <FormItem label="任务名称：" required>
          <input type="text"
                 className="form-control"
                 value={this.state.label}
                 onChange={this.handleChange.bind(this,'label')}/>
        </FormItem>
        <FormItem label="任务描述：">
                    <textarea
                      rows="4"
                      className="form-control"
                      value={this.state.password}
                      onChange={this.handleChange.bind(this,'password')}/>
        </FormItem>
      </Form>
    );
  }
});

export default StartWin;