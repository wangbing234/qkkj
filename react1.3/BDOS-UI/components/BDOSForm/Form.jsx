/***************************************************
 * 时间: 7/16/16 09:07
 * 作者: zhongxia
 * 说明: 表单组件
 ***************************************************/
import React, { PropTypes } from 'react'
import classNames from 'classnames'

class Form extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {};
  }

  render() {
    const {children,...other} = this.props;
    return (
      <form className="bdos-form" action="">
        {children}
      </form>
    );
  }
}

export default Form