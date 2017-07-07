/***************************************************
 * 时间: 8/2/16 14:18
 * 作者: zhongxia
 * 说明: 表单生成器
 *
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'
import FormGenerator from 'Base/FormGenerator'

class FormGeneratorDemo extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  render() {
    const formConfig = [
      {label: '名称', valueFiled: 'name', required: true, help: '请输入用户名称'},
      {label: '年龄', valueFiled: 'age', required: true},
      {label: '地址', valueFiled: 'address', required: true}
    ]
    return (
      <div>
        <FormGenerator config={formConfig}/>
      </div>
    );
  }
}

export default FormGeneratorDemo