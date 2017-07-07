/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:汇聚节点弹出框
 *
 ***************************************************/
import React from 'react'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import RestrictInput from 'CommonComponent/component/restrictinput'
import BaseValidate from 'CommonComponent/utils/BaseValidate'
import { Select ,Option} from 'bfd-ui/lib/Select2'
const Win = React.createClass({
  //初始化表单数据。
  getInitialState() {
    this.rules = {
      chinaName(validateVal) {
        return BaseValidate.validateInput({isRequired: true, label: "名称", value: validateVal, maxLength: 16});
      }
    }
    return {
      ...this.props.data,
      chinaName:this.props.data.label
    }
  },
  /**
   * 基本的约束,外部写的组件,必须使用 getData 方法,否则框架获取不到数据
   * @returns {*}
   */
  getData() {

    return this.state;
  },

  /**
   * 公用验证
   * @returns {boolean}
     */
  vaildate()
  {
    const obj = this.refs._from.validate(this.state);
    if (obj) {    //验证通过
      console.log('表单验证通过',obj);
      return true;
    } else {              //验证失败
      console.log('表单验证失败');
    }
    return false;
  },

  handleChange(name, event) {
    let newState = {};
    if (event && event.target) {
      newState[name] = name === "checked" ? event.target.checked : event.target.value;
    } else {
      newState[name] = event;
    }
    this.setState({...newState, validateState: false});
  },
  render() {
    return (
      <Form horizontal  ref="_from" labelWidth="120" className="popUpWinStyle"  rules={this.rules}>
        <FormItem label="名称"  name="chinaName" required >
          <RestrictInput className="form-control common-form-input" type="text"
                         tipString = "只能输入中文字母、数字、下划线、长度小于16个字符"
                         value={this.state.chinaName}
                         onChange={this.handleChange.bind(this,'chinaName')}/>
        </FormItem>
      </Form>
    );
  }
});

export default Win;