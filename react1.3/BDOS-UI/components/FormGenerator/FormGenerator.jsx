/***************************************************
 * 时间: 8/2/16 14:19
 * 作者: zhongxia
 * 说明: 根据配置动态生成表单, 并集成验证功能, 自定义提示功能 [目前只支持文本框]
 * TODO: 1. 后期增加 下拉框, 文本域, 正则验证 等功能
 const formConfig = [
 {label: '名称', valueFiled: 'name', required: true, help: '请输入用户名称'},
 {label: '年龄', valueFiled: 'age', required: true},
 {label: '地址', valueFiled: 'address', required: true}
 ]
 <FormGenerator config={formConfig} close={()=>{   }} submit={(data)=>{  }}/>
 ***************************************************/
import './style.less'
import React, { PropTypes } from 'react'
import classNames from 'classnames'

//bfd-ui组件库组件
import { Form, FormItem } from 'bfd-ui/lib/Form'
import FormInput from 'bfd-ui/lib/FormInput'
import FormTextarea from 'bfd-ui/lib/FormTextarea'
import { FormSelect, Option } from 'bfd-ui/lib/FormSelect'

class FormGenerator extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      formData: {}
    };
    this.rules = {};

    this.style = {
      width: {
        width: 200,
        display: 'inline-block'
      },
      center: {
        marginLeft: 100
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
    this.setState({formData: newState});
  }


  /**
   * 添加表单验证
   * @param item
   */
  addFormItemRule(item) {
    let valueFiled = item.valueFiled;
    let label = item.label;

    this.rules[valueFiled] = (val)=> {
      if (!val) return `${label}不能为空!`
    }
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
    const form = this.refs.form;
    if (form.validate()) {
      //TODO:验证通过
      this.props.submit && this.props.submit(this.state.formData)
      this.close();
    }
  }

  /**
   * 渲染文本表单
   * @param item 表单项配置
   */
  renderInput(item, index) {
    let label = item.label || `字段${index}`;  //表单名
    let valueFiled = item.valueFiled || `value${index}`;  //表单字段值
    let type = item.type || "text";    //文本框
    let help = item.help;  //输入提示

    let prop = {};
    if (item.required) {
      prop["required"] = item.required;
      this.addFormItemRule(item);
    }

    return (
      <FormItem key={index} label={label} help={help} name={valueFiled} {...prop} >
        <input type={type}
               style={this.style.width}
               className="form-control"
               value={this.state.formData[valueFiled]}
               onChange={this.handleChange.bind(this,valueFiled)}/>
      </FormItem>
    )
  }

  /**
   * 渲染下拉框
   */
  renderSelect() {

  }

  /**
   * 渲染文本域
   */
  renderTextarea() {

  }

  /**
   * 渲染表单项
   */
  renderFormItems() {
    const config = this.props.config;
    let items = [];
    for (var i = 0; i < config.length; i++) {
      var item = config[i];
      items.push(this.renderInput(item, i));
    }
    return items;
  }

  render() {
    let formData = this.state.formData;
    return (
      <Form ref="form"
            className="bdos-form-generator"
            data={formData} rules={this.rules}>

        {this.renderFormItems()}

        <div style={this.style.center}>
          <button type="button"
                  style={{marginRight:30}}
                  className="btn btn-sm btn-primary" onClick={this.submit.bind(this)}>确定
          </button>

          <button type="button"
                  className="btn btn-sm btn-default" onClick={this.close.bind(this)}>取消
          </button>
        </div>
      </Form>
    );
  }
}

FormGenerator.propTypes = {
  config: PropTypes.array.isRequired
}
FormGenerator.defaultProps = {
  config: []
}

export default FormGenerator