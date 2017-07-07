import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form'

const EndWin = React.createClass({
  //初始化表单数据。
  getInitialState() {
    return {
      ...this.props.data
    }
  },

  getData() {
    return this.state;
  },
  isArray(v) {
    return (toString.apply(v) === '[object Array]');
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
        <FormItem label="结束节点名称：" required>
          <input type="text"
                 className="form-control"
                 value={this.state.label}
                 onChange={this.handleChange.bind(this,'label')}/>
        </FormItem>
        <FormItem label="结束描述：">
                    <textarea
                      rows="4"
                      className="form-control"
                      value={this.state.intro}
                      onChange={this.handleChange.bind(this,'intro')}/>
        </FormItem>
      </Form>
    );
  }
});

export default EndWin;